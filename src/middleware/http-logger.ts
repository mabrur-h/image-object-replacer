import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const start = Date.now();

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = Date.now() - start;
    Logger.http(`${method} ${url} ${statusCode} - ${responseTime}ms`);
  });

  next();
};
