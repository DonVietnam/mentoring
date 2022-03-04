import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { calendar_v3, google } from 'googleapis';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarEventAttendee } from './entities/calendar-event-attendee.entity';
import { GravatarService } from '../gravatar/gravatar.service';
import { CalendarsService } from '../calendars/calendars.service';

@Injectable()
export class EventsService {
  private calendar: calendar_v3.Calendar;

  constructor(
    private readonly authService: AuthService,
    private readonly gravatarService: GravatarService,
    private readonly calendarsService: CalendarsService,
  ) {
    this.calendar = google.calendar({ version: 'v3' });
  }

  async getEvents(teamId: string, startDate: Date, endDate: Date) {
    const sharedCalendars = this.calendarsService.getSharedCalendars(teamId);
    const result: CalendarEvent[] = [];

    for (const calendar of sharedCalendars) {
      const auth = this.authService.getGoogleAuthToken();
      const response = await this.calendar.events.list({
        auth: auth,
        calendarId: calendar,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
      });
      const events = await this.parseEvents(response.data.items);
      result.push(...events);
    }
    return result;
  }

  private async parseEvents(events: calendar_v3.Schema$Event[]) {
    const result: CalendarEvent[] = [];
    for (const event of events) {
      result.push({
        id: event.id,
        summary: event.summary,
        description: event.description,
        location: event.location,
        hangoutLink: event.hangoutLink,
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
    if (attendees) {
      const result: CalendarEventAttendee[] = [];

      for (const attendee of attendees) {
        const profile = await this.gravatarService.getProfile(attendee.email);

        if (!profile) continue;

        result.push({ email: attendee.email, ...profile });
      }
      return result;
    }
  }
}
