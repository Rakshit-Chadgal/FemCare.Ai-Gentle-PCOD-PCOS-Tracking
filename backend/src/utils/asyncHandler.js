/**
 * Wraps an async route handler and forwards any thrown error to Express's
 * next(err) so the global errorHandler picks it up.
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
