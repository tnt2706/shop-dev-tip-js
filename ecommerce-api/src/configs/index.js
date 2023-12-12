const container = require('./container.config');
const db = require('./db.config');
const cloudinary = require('./cloudinary.config');
const aws = require('./aws.config');

module.exports = {
  ...container,
  ...db,
  ...cloudinary,
  ...aws,
};
