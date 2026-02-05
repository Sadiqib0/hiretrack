import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CvsService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement cvs logic
}
