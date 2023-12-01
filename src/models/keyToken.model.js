const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const KeySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Shop', require: true, },

  publicKey: { type: String, require: true, },
  privateKey: { type: String, require: true, },

  refreshTokenUsed: { type: [String], default: [] },
  refreshToken: { type: String, },
},{
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, KeySchema);
