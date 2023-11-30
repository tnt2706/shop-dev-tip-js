// !dmbg

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const ShopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },

  email: {
    type: String,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    require: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
  },

  verify: {
    type: Schema.Types.Boolean,
    default: false,
  },

  roles: {
    type: [String],
    default: [],
  },

},
{
  timestamps: true,
  collation: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, ShopSchema);
