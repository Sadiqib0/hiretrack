import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        emailVerified: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(id: string, data: any) {
    const updateData: any = {};

    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.picture !== undefined) updateData.picture = data.picture;

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        picture: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
      },
    });
  }
}