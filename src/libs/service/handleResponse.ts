import { HttpStatus, HttpException } from '@nestjs/common';
import { ResponseData } from 'src/libs/utility/constants/response';
import { ApiResponse } from '../utility/constants/interface';

export function HandleResponse<T = unknown>(
  statusCode: number,
  status: string,
  message?: string,
  data?: T,
  error?: unknown,
): ApiResponse<T> | never {
  if (status === ResponseData.SUCCESS) {
    return {
      statusCode: statusCode || HttpStatus.OK,
      status,
      message,
      data,
      error,
    };
  }

  throw new HttpException(
    {
      statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      status,
      message,
      data,
      error,
    },
    statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
