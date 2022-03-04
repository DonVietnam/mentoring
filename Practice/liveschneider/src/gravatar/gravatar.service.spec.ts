import { Test, TestingModule } from '@nestjs/testing';
import { GravatarService } from './gravatar.service';
import { HttpModule } from '@nestjs/axios';
import { AppLoggerModule } from '../miscellaneous/app-logger/app-logger.module';

describe('GravatarService', () => {
  let service: GravatarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, AppLoggerModule],
      providers: [GravatarService],
    }).compile();

    service = module.get<GravatarService>(GravatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile()', () => {
    it('non-existing profile should return null', async () => {
      const nonExistingEmail = 'jest-test-email1@gmail.com';

      expect(await service.getProfile(nonExistingEmail)).toEqual(null);
    });
  });
});
