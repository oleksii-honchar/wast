import { Request, Response, NextFunction } from 'express';
import * as HttpStatusCodes from 'http-status-codes';
import * as toobusy from 'toobusy-js';

import { is } from 'src/utils/is';

toobusy.maxLag(300);
toobusy.interval(500);

export function tooBusyMiddleware(req: Request, res: Response, next: NextFunction) {
  const free = is.falsy(toobusy());

  if (free) {
    return next();
  }

  const error = new Error('I\'m busy right now, sorry.');
  error.code = HttpStatusCodes.SERVICE_UNAVAILABLE;
  delete error.stack;
  return next(error);
}
