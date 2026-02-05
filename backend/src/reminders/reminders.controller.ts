import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';

@ApiTags('reminders')
@Controller('reminders')
@ApiBearerAuth()
export class RemindersController {
  constructor(private remindersService: RemindersService) {}
  
  // TODO: Implement reminders endpoints
}
