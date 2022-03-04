import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
