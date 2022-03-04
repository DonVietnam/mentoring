import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { GravatarModule } from '../gravatar/gravatar.module';
import { AuthModule } from '../auth/auth.module';
import { CalendarsModule } from '../calendars/calendars.module';

@Module({
  imports: [GravatarModule, AuthModule, CalendarsModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
