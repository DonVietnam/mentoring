import { CalendarEventAttendee } from './calendar-event-attendee.entity';

export class CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  created: Date;
  updated: Date;
  startDate: Date;
  endDate: Date;
  attendees?: CalendarEventAttendee[];
}
