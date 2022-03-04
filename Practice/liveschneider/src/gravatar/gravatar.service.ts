import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as gravatar from 'gravatar';
import { lastValueFrom, map } from 'rxjs';
import { AppLoggerService } from '../miscellaneous/app-logger/app-logger.service';
import winston from 'winston';

@Injectable()
export class GravatarService {
  private logger: winston.Logger;

  constructor(
    private readonly httpService: HttpService,
    private readonly loggerService: AppLoggerService,
  ) {
    this.logger = loggerService.getLogger();
  }

  async getProfile(email: string) {
    const profileUrl = gravatar.profile_url(email, { protocol: 'https' });

    return await lastValueFrom(
      this.httpService.get(profileUrl).pipe(
        map((response) => ({
          photoUrl: response.data.entry[0].thumbnailUrl,
          displayName: response.data.entry[0].displayName,
          role: response.data.entry[0].aboutMe,
          company: response.data.entry[0].currentLocation,
        })),
      ),
    ).catch(() => {
      this.logger.info(`gravatar profile with email:${email} not found`);
      return null;
    });
  }
}
