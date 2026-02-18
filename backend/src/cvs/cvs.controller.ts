import { 
  Controller, 
  Post, 
  Get, 
  Delete, 
  Param, 
  Patch, 
  UseInterceptors, 
  UploadedFile, 
  Body, 
  UseGuards, 
  Request,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; // Add this
import { extname } from 'path'; // Add this
import { CvsService } from './cvs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cvs')
@UseGuards(JwtAuthGuard)
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // 1. Define where to save the files
        destination: './uploads/cvs', 
        // 2. Define how to name the files (prevents duplicates)
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async upload(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: any
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User session not found');
    }

    // Now file.filename will exist and be passed to your service!
    return this.cvsService.upload(req.user.id, file, data);
  }

  // ... rest of your methods (Get, Patch, Delete) remain the same
  @Get()
  async findAll(@Request() req: any) {
    return this.cvsService.findAll(req.user.id);
  }

  @Patch(':id/default')
  async setDefault(@Param('id') id: string, @Request() req: any) {
    return this.cvsService.setDefault(id, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.cvsService.delete(id, req.user.id);
  }
}