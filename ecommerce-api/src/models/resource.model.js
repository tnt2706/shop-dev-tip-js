// !dmbg

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Resource';
const COLLECTION_NAME = 'Resources';

const ResourceSchema = new Schema({
  src_name: { type: Number, require: true }, // profile
  src_slug: { type: String, require: true }, // 000001
  src_description: { type: String, default: '' },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, ResourceSchema);
