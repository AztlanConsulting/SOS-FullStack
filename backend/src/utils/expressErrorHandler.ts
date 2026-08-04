import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import util from 'util';
import logger from '@/utils/logger';

const normalizeError = (value: unknown): unknown => {
  if (value instanceof Error) {
    const errorObject: Record<string, unknown> = {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
    Object.getOwnPropertyNames(value).forEach((key) => {
      if (!['name', 'message', 'stack'].includes(key)) {
        try {
          errorObject[key] = (value as any)[key];
        } catch {
          // ignore inaccessible properties
        }
      }
    });
    return errorObject;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeError);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce(
      (acc, [key, entry]) => {
        acc[key] = normalizeError(entry);
        return acc;
      },
      {} as Record<string, unknown>,
    );
  }
  return value;
};

export function expressErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = err as any;
  let errorMessage: string;
  if (error instanceof Error) errorMessage = error.message;
  else if (typeof error === 'string') errorMessage = error;
  else {
    try {
      errorMessage = util.inspect(error, { depth: null });
    } catch {
      errorMessage = String(error);
    }
  }

  const meta: any = {
    stack: error?.stack,
    method: req?.method,
    url: req?.originalUrl,
    body: req?.body,
    query: req?.query,
    headers: req?.headers,
    error: normalizeError(error),
  };

  if (error instanceof ZodError) meta.validation = error.issues;

  try {
    meta.rawError = util.inspect(error, { depth: null });
  } catch {}

  logger.error(`Unhandled error in request: ${errorMessage}`, meta);

  if (!res.headersSent) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: error.issues });
    }

    if (
      error?.type === 'request.aborted' ||
      error?.code === 'ECONNABORTED' ||
      error?.message === 'request aborted'
    ) {
      return res.status(408).json({
        error: 'Request aborted',
        details: 'The request was interrupted before it completed.',
      });
    }

    return res
      .status(error?.status || 500)
      .json({ error: 'Internal Server Error' });
  }

  next(err as any);
}
