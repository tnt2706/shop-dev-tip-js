const dev = {
  database:
    process.env.DEV_DB_CONNECTION_STRING || 'mongodb://localhost:27017/shopDev',
};

const production = {
  database:
    process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/shopDev',
};

const config = { dev, production };
const env = process.env.NODE_ENV;

module.exports = config[env];
