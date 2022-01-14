import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { calendar_v3, google } from 'googleapis';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarEventAttendee } from './entities/calendar-event-attendee.entity';
import { GravatarService } from '../gravatar/gravatar.service';

@Injectable()
export class EventsService {
  private calendar: calendar_v3.Calendar;

  constructor(
    private readonly authService: AuthService,
    private readonly gravatarService: GravatarService,
  ) {
    this.calendar = google.calendar({ version: 'v3' });
  }

  async search(startDate: Date, endDate: Date) {
    const auth = this.authService.getAuth();
    const response = await this.calendar.events.list({
      auth: auth,
      calendarId: process.env.CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
    });
    return this.parseEvents(response.data.items);
  }

  private async parseEvents(events: calendar_v3.Schema$Event[]) {
    const result: CalendarEvent[] = [];
    for (const event of events) {
      result.push({
        id: event.id,
        summary: event.summary,
        description: event.description,
        location: event.location,
        created: new Date(event.created),
        updated: new Date(event.updated),
        startDate: new Date(event.start.date || event.start.dateTime),
        endDate: new Date(event.end.date || event.end.dateTime),
        attendees: await this.parseAttendees(event.attendees),
      });
    }
    return result;
  }

  private async parseAttendees(attendees: calendar_v3.Schema$EventAttendee[]) {
    if (!attendees) return undefined;
    const result: CalendarEventAttendee[] = [];
    for (const attendee of attendees) {
      const gravatarProfile = await this.gravatarService.getProfile(
        attendee.email,
      );
      result.push({
        email: attendee.email,
        photo: this.gravatarService.getProfilePhoto(attendee.email),
        ...gravatarProfile,
      });
    }
    return result;
  }
}
