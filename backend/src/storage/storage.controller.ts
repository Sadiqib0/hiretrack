import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
@ApiBearerAuth()
export class StorageController {
  constructor(private storageService: StorageService) {}
  
  // TODO: Implement storage endpoints
}
