const uuid = require('uuid') ;
const logger = require('libs/logger');

const log = logger.get();

/**
 * request logger
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
function requestLoggerMiddleware (req, res, next) {
  const headerName = 'x-request-id';
  const id = req.headers[headerName] || uuid.v4();

  req.log = log.child({
    type: 'request',
    id,
  });

  res.setHeader(headerName, id);
  req.log.info({ req }, 'start request');

  res.on('finish', () => {
    const bodyStr = JSON.stringify(res.body) || res.statusMessage;
    const resBodySize = bodyStr.length;
    if (resBodySize > 400) {
      res.body = `${bodyStr.substring(0, 400)
      }\n<content trimmed to [${400}] from [${resBodySize}]>\n`;
    }

    req.log.info({ res }, 'end request');
  });

  next();
}

module.exports = { requestLoggerMiddleware };
