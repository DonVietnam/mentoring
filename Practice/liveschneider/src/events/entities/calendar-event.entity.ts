import { CalendarEventAttendee } from './calendar-event-attendee.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarEvent {
  @ApiProperty({
    example: '50jdsrr4fip3547q722sfs0fb4',
    description: 'event id',
  })
  id: string;
  @ApiProperty({
    example: 'super party at home',
    description: 'event summary',
    required: false,
  })
  summary?: string;
  @ApiProperty({
    example: 'amazing party with ice-creams and coca-cola',
    description: 'event description',
    required: false,
  })
  description?: string;
  @ApiProperty({
    example: 'Minsk, Belarus',
    description: 'event location',
    required: false,
  })
  location?: string;
  @ApiProperty({
    example: 'https://meet.google.com/wib-fgkq-iwo',
    description: 'event hangout link',
    required: false,
  })
  hangoutLink?: string;
  @ApiProperty({
    example: '2022-01-14T14:27:09.000Z',
    description: 'event created date',
  })
  created: Date;
  @ApiProperty({
    example: '2022-01-14T14:27:52.105Z',
    description: 'event updated date',
  })
  updated: Date;
  @ApiProperty({
    example: '2022-01-14T16:15:00.000Z',
    description: 'event start date',
  })
  startDate: Date;
  @ApiProperty({
    example: '2022-01-14T14:15:00.000Z',
    description: 'event end date',
  })
  endDate: Date;
  @ApiProperty({
    type: [CalendarEventAttendee],
    description: 'event end attendees',
  })
  attendees?: CalendarEventAttendee[];
}
