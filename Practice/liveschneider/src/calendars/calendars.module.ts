import { Module } from '@nestjs/common';
import { CalendarsController } from './calendars.controller';
import { CalendarsService } from './calendars.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  exports: [CalendarsService],
  controllers: [CalendarsController],
  providers: [CalendarsService],
})
export class CalendarsModule {}
