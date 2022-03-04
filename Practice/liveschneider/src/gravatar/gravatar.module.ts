import { Module } from '@nestjs/common';
import { GravatarService } from './gravatar.service';
import { HttpModule } from '@nestjs/axios';
import { AppLoggerModule } from '../miscellaneous/app-logger/app-logger.module';

@Module({
  imports: [HttpModule, AppLoggerModule],
  exports: [GravatarService],
  providers: [GravatarService],
})
export class GravatarModule {}
