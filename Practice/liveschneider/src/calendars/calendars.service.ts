import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';

@Injectable()
export class CalendarsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  getSharedCalendars(merchantId: string) {
    const sharedCalendars: string[] = [];
    const sharedCalendarsDb = this.filesService.readYml(
      this.configService.get('SHARED_CALENDARS_PATH'),
    );
    const team = Object.values(sharedCalendarsDb)
      .filter((value) => value.hasOwnProperty('id'))
      .find((team) => team.id == merchantId);

    if (team) sharedCalendars.push(...team.common, ...team.personal);

    return sharedCalendars;
  }
}
