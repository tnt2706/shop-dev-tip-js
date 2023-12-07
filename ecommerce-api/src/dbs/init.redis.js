const redis = require('redis');

const client = redis.createClient();

const connectRedis = async () => {
  await client.connect();

  client.on('error', err => {
    console.error(`An error occurred with Redis: ${err}`);
  });

  console.log('Redis connected successfully...');
};

(async () => {
  connectRedis();
})();

module.exports = client;
