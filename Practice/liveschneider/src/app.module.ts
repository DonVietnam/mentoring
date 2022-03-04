import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { JiraTicketsModule } from './jira/tickets/jira-tickets.module';
import { AppLoggerModule } from './miscellaneous/app-logger/app-logger.module';
import { HealthModule } from './health/health.module';
import { CalendarsModule } from './calendars/calendars.module';

@Module({
  imports: [
    CalendarsModule,
    EventsModule,
    JiraTicketsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AppLoggerModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
