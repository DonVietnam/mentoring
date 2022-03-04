import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Ping the application' })
  @ApiResponse({ status: 200 })
  @Get('ping')
  async ping() {
    return {
      status: 'ok',
    };
  }
}
