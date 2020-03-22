const toobusy = require('toobusy-js');

toobusy.maxLag(300);
toobusy.interval(500);

/**
 * too busy
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {*}
 */
function tooBusyMiddleware (req, res, next) {
  if (!toobusy()) {
    return next();
  }

  const err = new Error('I\'m busy right now, sorry.');
  err.code = 503;
  delete err.stack;
  return next(err);
}

module.exports = { tooBusyMiddleware };
