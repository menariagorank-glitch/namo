import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/api-response.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Centralized error handler caught an error: ${err.message}`);

  if (err instanceof AppError) {
    sendError(res, err.message, undefined, err.statusCode);
    return;
  }

  // Handle Express JSON Syntax Parsing Error
  if (err instanceof SyntaxError && 'status' in err && (err as { status?: number }).status === 400) {
    sendError(res, 'Invalid JSON body format.', undefined, 400);
    return;
  }

  const message =
    env.NODE_ENV === 'production'
      ? 'Unable to process request. Please try again.'
      : err.message || 'Internal Server Error';

  sendError(res, message, undefined, 500);
};

