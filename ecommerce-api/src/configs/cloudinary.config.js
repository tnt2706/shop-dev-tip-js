const cloudinary = require('cloudinary');

const dev = {
  cloud_name: process.env.DEV_CLOUDINARY_CLOUD_NAME || 'shopeco',
  api_key: process.env.DEV_CLOUDINARY_API_KEY || '585557372997499',
  api_secret: process.env.DEV_CLOUDINARY_API_SECRET || 'rKRl78FjxG9Uw7HD5vF5c-tvCG0',
  // secure: process.env.DEV_CLOUDINARY_SECURE || true,

};

const production = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'shopeco',
  api_key: process.env.CLOUDINARY_API_KEY || '585557372997499',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rKRl78FjxG9Uw7HD5vF5c-tvCG0',
  // secure: process.env.CLOUDINARY_SECURE || true,
};

const config = { dev, production };
const env = process.env.NODE_ENV;

module.exports = cloudinary.v2.config(config[env]);
