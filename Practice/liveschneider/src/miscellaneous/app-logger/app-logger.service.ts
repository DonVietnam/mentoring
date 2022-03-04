import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class AppLoggerService {
  getLogger() {
    return createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'accelerator-api' },
      transports: [new transports.File({ filename: 'accelerator-api.log' })],
    });
  }
}
