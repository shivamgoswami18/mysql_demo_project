import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseData } from 'src/libs/utility/constants/response';
import { Response } from 'express';
import { ErrorResponse } from 'src/libs/utility/constants/interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('Exception Caught:', exception);

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let exMessage = 'Internal Server Error';

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as ErrorResponse;

      httpStatus = res.statusCode ?? exception.getStatus();

      if (res.message) {
        exMessage = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message;
      }
    } else if (typeof exception === 'object' && exception !== null) {
      const err = exception as ErrorResponse;

      if (err.statusCode) httpStatus = err.statusCode;

      if (err.message) {
        exMessage = Array.isArray(err.message)
          ? err.message.join(', ')
          : err.message;
      }
    }

    if (!exMessage) {
      exMessage = 'Unexpected Error Occurred';
    }

    const responseBody = {
      statusCode: httpStatus,
      status: ResponseData.ERROR,
      message: exMessage,
    };

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
