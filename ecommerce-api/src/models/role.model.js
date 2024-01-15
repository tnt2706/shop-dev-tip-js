// !dmbg

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

// const grantList = [
//   { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
//   { role: 'admin', resource: 'balance', action: 'update:any', attributes: '*,!amount' },

//   { role: 'shop', resource: 'profile', action: 'update:own', attributes: '*' },
//   { role: 'shop', resource: 'balance', action: 'update:own', attributes: '*,!amount' },

//   { role: 'user', resource: 'profile', action: 'update:own', attributes: '*' },
//   { role: 'user', resource: 'balance', action: 'read:own', attributes: '*' },
// ];

const RoleSchema = new Schema({
  rol_name: { type: String, default: 'user', enum: ['user', 'shop', 'admin'] },
  rol_slug: { type: String, default: true },
  rol_status: { type: String, default: 'active', enum: ['pending', 'active', 'block'] },
  rol_description: { type: String, default: '' },
  rol_grants: [
    {
      resource: { type: Schema.Types.ObjectId, ref: 'Resource', require: true },
      actions: [{ type: String, require: true }],
      attributes: { type: String, default: '*' },
    },
  ],
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, RoleSchema);
