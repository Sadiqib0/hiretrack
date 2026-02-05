import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('applications')
@Controller('applications')
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    return this.applicationsService.create(user.id, data);
  }

  @Get()
  async findAll(@CurrentUser() user: any, @Query() filters: any) {
    return this.applicationsService.findAll(user.id, filters);
  }

  @Get('stats')
  async getStats(@CurrentUser() user: any) {
    return this.applicationsService.getStats(user.id);
  }

  @Get(':id')
  async findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationsService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
    return this.applicationsService.update(id, user.id, data);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.applicationsService.delete(id, user.id);
  }
}
