import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthModule } from '../auth/auth.module';
import { GravatarModule } from '../gravatar/gravatar.module';

@Module({
  imports: [AuthModule, GravatarModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
