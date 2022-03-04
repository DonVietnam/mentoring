import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../app-logger/app-logger.service';
import winston from 'winston';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private logger: winston.Logger;

  constructor(private loggerService: AppLoggerService) {
    this.logger = loggerService.getLogger();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.logger.info(exception.message);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
