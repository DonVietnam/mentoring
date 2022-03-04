import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly authService: AuthService) {}

  async getJiraProject(projectKey: string) {
    const client = this.authService.getAtlassianClient();

    return await client.projects.getProject({ projectIdOrKey: projectKey });
  }
}
