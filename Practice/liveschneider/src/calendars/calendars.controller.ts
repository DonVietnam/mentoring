import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CalendarsService } from './calendars.service';

@ApiTags('Calendars')
@Controller('calendars')
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {}

  @ApiOperation({ summary: 'get shared calendars by merchant id' })
  @ApiQuery({ example: '1' })
  @Get('shared')
  getSharedCalendars(@Query('merchantId') merchantId: string) {
    return this.calendarsService.getSharedCalendars(merchantId);
  }
}
