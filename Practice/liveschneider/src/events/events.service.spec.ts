import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesModule } from '../files/files.module';
import { GravatarModule } from '../gravatar/gravatar.module';
import { AuthModule } from '../auth/auth.module';
import { CalendarsModule } from '../calendars/calendars.module';
import { EventsController } from './events.controller';
import { EventsModule } from './events.module';
import { JiraTicketsModule } from '../jira/tickets/jira-tickets.module';
import { AppLoggerModule } from '../miscellaneous/app-logger/app-logger.module';
import { HealthModule } from '../health/health.module';

describe('EventsService', () => {
  let service: EventsService;

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

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
