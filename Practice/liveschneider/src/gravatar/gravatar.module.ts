import { Module } from '@nestjs/common';
import { GravatarService } from './gravatar.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [GravatarService],
  providers: [GravatarService],
})
export class GravatarModule {}
