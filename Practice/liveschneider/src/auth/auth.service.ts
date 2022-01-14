import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

@Injectable()
export class AuthService {
  private CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
  private SCOPES = ['https://www.googleapis.com/auth/calendar'];

  getAuth(): JWT {
    return new google.auth.JWT(
      this.CREDENTIALS.client_email,
      null,
      this.CREDENTIALS.private_key,
      this.SCOPES,
    );
  }
}
