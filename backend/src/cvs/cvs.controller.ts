import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CvsService } from './cvs.service';

@ApiTags('cvs')
@Controller('cvs')
@ApiBearerAuth()
export class CvsController {
  constructor(private cvsService: CvsService) {}
  
  // TODO: Implement cvs endpoints
}
