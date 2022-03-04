import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { CreateJiraTicketDto } from './dto/jira-ticket-create.dto';

@Injectable()
export class JiraTicketsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async createTicket(ticketData: CreateJiraTicketDto) {
    const client = this.authService.getAtlassianClient();
    const projectId = this.configService.get('JIRA_PROJECT_ID');
    const issueTypes = await this.getIssuesTypes(projectId);

    return await client.issues.createIssue({
      fields: {
        summary: ticketData.GameTitle,
        project: {
          id: projectId,
        },
        issuetype: {
          id: issueTypes[0].id,
        },
        description: JiraTicketsService.createTicketDescription(ticketData),
      },
    });
  }

  async getIssuesTypes(projectId: number) {
    const client = this.authService.getAtlassianClient();

    return await client.issueTypes.getIssueTypesForProject({
      projectId: projectId,
    });
  }

  async receiveTicketUpdatedWebhook(ticketId: string) {
    const client = this.authService.getAtlassianClient();
    const projectId = this.configService.get('JIRA_PROJECT_ID');

    const { issues } = await client.issueSearch.searchForIssuesUsingJqlPost({
      jql: `project = ${projectId} AND id = ${ticketId}`,
      validateQuery: 'none',
    });

    if (!issues[0])
      throw new NotFoundException(`ticket with ${ticketId} not found`);

    return issues[0];
  }

  private static createTicketDescription(ticketData: CreateJiraTicketDto) {
    return Object.entries(ticketData)
      .map((entry) => (entry[0] ? `*${entry[0]}:* ${entry[1]}` : ``))
      .join('\n');
  }
}
