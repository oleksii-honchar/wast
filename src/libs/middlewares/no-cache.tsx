/**
 * no cache
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
function noCacheMiddleware (req, res, next) {
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
  next();
}

module.exports = { noCacheMiddleware };
