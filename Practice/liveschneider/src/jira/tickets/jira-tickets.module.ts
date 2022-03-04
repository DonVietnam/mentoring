import { Module } from '@nestjs/common';
import { JiraTicketsController } from './jira-tickets.controller';
import { JiraTicketsService } from './jira-tickets.service';
import { AuthModule } from '../../auth/auth.module';
import { FilesModule } from '../../files/files.module';

@Module({
  imports: [AuthModule, FilesModule],
  controllers: [JiraTicketsController],
  providers: [JiraTicketsService],
})
export class JiraTicketsModule {}
