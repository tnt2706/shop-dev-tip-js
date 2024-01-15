const asyncHandel = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = {
  asyncHandel,
};
