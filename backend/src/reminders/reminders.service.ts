import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}
  
  // TODO: Implement reminders logic
}
