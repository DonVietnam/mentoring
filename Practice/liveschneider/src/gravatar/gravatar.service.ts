import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as gravatar from 'gravatar';
import { GravatarProfile } from './entities/gravatar-profile.entity';

@Injectable()
export class GravatarService {
  constructor(private readonly httpService: HttpService) {}

  getProfilePhoto(email: string): string {
    return gravatar.url(email, {
      protocol: 'https',
      s: '200',
    });
  }

  async getProfile(email: string) {
    const profileUrl = gravatar.profile_url(email, {
      protocol: 'https',
    });
    const profile = new GravatarProfile();
    await this.httpService
      .get(profileUrl)
      .toPromise()
      .then((res) => {
        profile.displayName = res.data.entry[0].displayName;
        profile.role = res.data.entry[0].aboutMe;
        profile.company = res.data.entry[0].currentLocation;
      })
      .catch((error) => console.log(`gravatar profile not found ${email}`));
    return profile;
  }
}
