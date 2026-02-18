import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvsService {
  constructor(private prisma: PrismaService) {}

  async upload(userId: string, file: Express.Multer.File, data: any) {
    // Determine the filename to save in DB. 
    // If Multer didn't provide a 'filename' (e.g. using memory storage), 
    // we generate a unique one using the timestamp.
    const finalFileName = file.filename || `${Date.now()}-${file.originalname}`;

    const cv = await this.prisma.cV.create({
      data: {
        user: {
          connect: { id: userId }
        },
        fileName: file.originalname,
        fileUrl: `/uploads/cvs/${finalFileName}`,
        fileSize: file.size,
        // s3Key is mandatory in your Prisma schema. 
        // We use the unique filename to satisfy this requirement.
        s3Key: finalFileName, 
        // Ensure version is a string and isDefault is a boolean
        version: data.version ? String(data.version) : '1',
        isDefault: data.isDefault === 'true' || data.isDefault === true,
      },
    });

    // If this CV is set as default, unset all other CVs for this user
    if (cv.isDefault) {
      await this.prisma.cV.updateMany({
        where: { 
          userId, 
          id: { not: cv.id } 
        },
        data: { isDefault: false },
      });
    }

    return cv;
  }

  async findAll(userId: string) {
    return this.prisma.cV.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async setDefault(id: string, userId: string) {
    // Unset current default
    await this.prisma.cV.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.cV.update({
      where: { id, userId },
      data: { isDefault: true },
    });
  }

  async delete(id: string, userId: string) {
    const cv = await this.prisma.cV.findFirst({
      where: { id, userId },
    });

    if (!cv) {
      throw new NotFoundException('CV not found');
    }

    // Attempt to delete the physical file from the local disk
    const relativePath = cv.fileUrl.startsWith('/') ? cv.fileUrl.substring(1) : cv.fileUrl;
    const filePath = path.join(process.cwd(), relativePath);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
        // We continue anyway to remove the record from the DB
      }
    }

    return this.prisma.cV.delete({
      where: { id },
    });
  }
}