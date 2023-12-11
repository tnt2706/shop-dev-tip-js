const container = require('./container');
const db = require('./db');
const cloudinary = require('./cloudinary.config');

module.exports = {
  ...container,
  ...db,
  ...cloudinary,
};
