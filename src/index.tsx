const http = require("http");
const tooBusy = require("toobusy-js");
const express = require("express");

const { noCacheMiddleware } = require("./libs/middlewares/no-cache");
const { tooBusyMiddleware } = require("./libs/middlewares/too-busy");
const { requestLoggerMiddleware } = require("./libs/middlewares/request-logger");

const logger = require("./libs/logger");

const pkg = require("../../../package.json");

process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";

const log = logger.get("APP-SVC", { ignoreLogLevel: true });
const port = process.env.APP_SVC_PORT || 4000;

log.info(`Starting app [${pkg.name}] ...`);

function initApp () {
  const app = express();

  app.set("port", port);
  app.set("x-powered-by", false);

  app.use(tooBusyMiddleware);
  app.use(requestLoggerMiddleware);
  app.use(noCacheMiddleware);

  const router = new express.Router();
  router.use(/\/assets/, [
    express.static("./dist"),
    (req: Request, res: Response, next: CallableFunction) => {
      if (!req["route"]) res.status(404);

      return next();
    },
  ]);

  app.use(router);

  const server = http.createServer(app);
  server.listen(port);
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    switch (error.code) {
      case "EACCES":
        log.error(`Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        log.error(`Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
  server.on("listening", () => {
    const addr = server.address();
    const bind = typeof addr === "string"
      ? `pipe ${addr}`
      : `port ${addr.port}`;
    log.info(`Listening on ${bind}`);
  });
  server.on("close", () => {
    log.info("Server stopped");
  });

  process.on("SIGINT", () => {
    tooBusy.shutdown();
    process.exit();
  });

  process.on("unhandledRejection", (reason, p) => {
    log.warn("Unhandled Rejection at: Promise", p, "reason:", reason);
  });
}

initApp();