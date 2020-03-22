import * as http from 'http';
import * as tooBusy from 'toobusy-js';
import * as express from 'express';
import { Router, Request, Response, NextFunction } from 'express';

import { getLogger } from './libs/logger';
// import { errorResponder, finalResponder } from './libs/responders';
import {
  noCacheMiddleware,
  tooBusyMiddleware,
  requestLoggerMiddleware
} from './libs/middlewares';

import * as package$ from 'package.json';

process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'error';

const logger = getLogger('SVC', { ignoreLogLevel: true });
const port = process.env.SERVE_PORT || 4000;

logger.info(`[ENV_NAME = ${process.env.ENV_NAME}]`);
logger.info(`[LOG_LEVEL = ${process.env.LOG_LEVEL}]`);
logger.info(`[NODE_ENV = ${process.env.NODE_ENV}]`);
logger.info(`[SERVE_PORT = ${port}]`);

logger.info(`Starting app [${package$.name}] ...`);

const app = express();

app.set('port', port);
app.set('x-powered-by', false);
app.set('query parser', 'extended');

app.use(tooBusyMiddleware);
app.use(requestLoggerMiddleware);
app.use(noCacheMiddleware);

const router =  Router();
router.use(/\/assets/, [
  express.static("./dist"),
  (req: Request, res: Response, next: CallableFunction) => {
    if (!req["route"]) res.status(404);

    return next();
  },
]);

app.use(router);

const server = http.createServer(app);

async function start() {
  server.listen(port);
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        logger.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', () => {
    const address = server.address()!;
    const bind = typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`;
    logger.info(`Listening on ${bind}`);
  });

  server.on('close', () => {
    logger.info('Server stopped');
  });

  process.on('SIGINT', () => {
    tooBusy.shutdown();
    process.exit();
  });

  process.on('unhandledRejection', (reason, p) => {
    logger.warn('Unhandled Rejection at: Promise', p, 'reason:', reason);
  });
}

start();