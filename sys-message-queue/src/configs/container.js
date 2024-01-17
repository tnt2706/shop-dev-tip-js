module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  hostName: process.env.HOSTNAME || 'common-reference',
  port: parseInt(process.env.PORT || '3052', 10),
};
