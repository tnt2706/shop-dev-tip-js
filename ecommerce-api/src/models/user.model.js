// !dmbg

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const UserSchema = new Schema({
  usr_id: { type: Number, require: true },
  usr_slug: { type: String, require: true },
  usr_name: { type: String, default: '' },
  usr_password: { type: String, default: '' },
  usr_salt: { type: String, default: '' },
  usr_email: { type: String, require: true },
  usr_phone: { type: String, default: '' },
  usr_sex: { type: String, default: '' },
  usr_avatar: { type: String, default: '' },
  usr_date_of_birth: { type: String, default: null },
  usr_role: { type: Schema.Types.ObjectId, ref: 'Role' },
  usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, UserSchema);
