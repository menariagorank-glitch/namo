import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { sendError } from '../utils/api-response.js';

export const validateRequest = (
  schema: ZodSchema,
  target: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[target]);
      if (target === 'body') {
        req.body = parsed;
      } else if (target === 'query') {
        req.query = parsed as any;
      } else if (target === 'params') {
        req.params = parsed as any;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        sendError(res, 'Validation failed', formattedErrors, 400);
        return;
      }
      next(error);
    }
  };
};
