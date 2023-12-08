const dev = {
  rabbitMq: process.env.DEV_RABBIT_MQ_CONNECTION_STRING || 'amqp://guest:tinhtran@localhost',
};

const production = {
  rabbitMq: process.env.DB_RABBIT_MQ_CONNECTION_STRING || 'amqp://guest:tinhtran@localhost',
};

const config = { dev, production };
const env = process.env.NODE_ENV;

module.exports = config[env];
