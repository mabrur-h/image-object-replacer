import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-error';
import Logger from '../utils/logger';
import { env } from '../config/env';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  Logger.error(`${err.name}: ${err.message}`);
  if (err.stack) {
    Logger.debug(err.stack);
  }

  let statusCode = 500;
  const errorResponse: ErrorResponse = {
    status: 'error',
    message: 'Internal Server Error',
  };

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    errorResponse.message = err.message;
  } else if (err instanceof Error) {
    errorResponse.message = err.message;
  }

  if (env.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  Logger.warn(`404 - ${req.method} ${req.originalUrl}`);
  next(error);
};
