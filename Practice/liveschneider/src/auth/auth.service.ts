import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { FilesService } from '../files/files.service';
import { ConfigService } from '@nestjs/config';
import { Version2Client } from 'jira.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  private SCOPES = ['https://www.googleapis.com/auth/calendar'];

  getGoogleAuthToken() {
    const clientEmail = this.configService.get('GOOGLE_SERVICE_ACCOUNT_EMAIL');

    const privateKey = JSON.parse(
      `{"key": "${this.configService.get('GOOGLE_SERVICE_ACCOUNT_KEY')}"}`,
    ).key;

    return new google.auth.JWT(clientEmail, null, privateKey, this.SCOPES);
  }

  getAtlassianClient() {
    const atlassianEmail = this.configService.get('ATLASSIAN_EMAIL');
    const atlassianApiToken = this.configService.get('ATLASSIAN_API_TOKEN');

    return new Version2Client({
      host: 'https://xsolla.atlassian.net',
      authentication: {
        basic: {
          email: atlassianEmail,
          apiToken: atlassianApiToken,
        },
      },
    });
  }
}
