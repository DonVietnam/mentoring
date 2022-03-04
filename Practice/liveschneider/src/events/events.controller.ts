import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CalendarEvent } from './entities/calendar-event.entity';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: 'get all events for period' })
  @ApiQuery({ name: 'teamId', example: '1' })
  @ApiQuery({ name: 'startDate', example: '2021-01-01' })
  @ApiQuery({ name: 'endDate', example: '2022-01-01' })
  @ApiResponse({ status: 200, type: [CalendarEvent] })
  @Get()
  getEvents(
    @Query('teamId') teamId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.eventsService.getEvents(teamId, startDate, endDate);
  }
}
