const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const CommentSchema = new Schema({
  comment_productId: { type: Schema.Types.ObjectId, require: true, ref: 'Product' },
  comment_userId: { type: Schema.Types.ObjectId },

  comment_content: { type: String, require: true },

  comment_left: { type: Number, default: 0, index: 1 },
  comment_right: { type: Number, default: 0, index: 1 },
  comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },

  isDeleted: { type: Boolean, default: false },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, CommentSchema);
