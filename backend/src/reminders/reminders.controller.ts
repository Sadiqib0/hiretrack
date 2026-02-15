import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RemindersService } from './reminders.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('reminders')
@ApiBearerAuth()
@Controller('reminders')  // ← This creates /api/reminders
@UseGuards(JwtAuthGuard)  // ← ADD THIS for auth
export class RemindersController {
  constructor(private remindersService: RemindersService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    console.log('Creating reminder for user:', user.id);
    console.log('Reminder data:', data);
    return this.remindersService.create(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.remindersService.findAll(user.id);
  }

  @Get('upcoming')
  async findUpcoming(@CurrentUser() user: any) {
    return this.remindersService.findUpcoming(user.id);
  }

  @Patch(':id/complete')
  async markComplete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.remindersService.markComplete(id, user.id);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.remindersService.delete(id, user.id);
  }
}