import { Module } from '@nestjs/common';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CvsController],
  providers: [CvsService],
})
export class CvsModule {}