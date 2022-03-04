import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JiraTicketsService } from './jira-tickets.service';
import { CreateJiraTicketDto } from './dto/jira-ticket-create.dto';

@ApiTags('Tickets')
@Controller('tickets')
export class JiraTicketsController {
  constructor(private readonly ticketsService: JiraTicketsService) {}

  @ApiOperation({ summary: 'create new jira ticket' })
  @Put()
  createTicket(@Body() ticketData: CreateJiraTicketDto) {
    return this.ticketsService.createTicket(ticketData);
  }

  @ApiOperation({ summary: 'webhook receiver for updated ticket in jira' })
  @ApiQuery({ name: 'ticketId', example: '515118' })
  @Post('webhookreceiver/updated')
  receiveTicketUpdatedWebhook(@Query('ticketId') ticketId: string) {
    return this.ticketsService.receiveTicketUpdatedWebhook(ticketId);
  }
}
