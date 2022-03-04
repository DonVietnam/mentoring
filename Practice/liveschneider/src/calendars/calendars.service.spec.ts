import { Test, TestingModule } from '@nestjs/testing';
import { CalendarsService } from './calendars.service';
import { FilesModule } from '../files/files.module';
import { CalendarsController } from './calendars.controller';
import { CalendarsModule } from './calendars.module';
import { EventsModule } from '../events/events.module';
import { JiraTicketsModule } from '../jira/tickets/jira-tickets.module';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerModule } from '../miscellaneous/app-logger/app-logger.module';
import { HealthModule } from '../health/health.module';

describe('CalendarsService', () => {
  let service: CalendarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<CalendarsService>(CalendarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
