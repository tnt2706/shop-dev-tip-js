const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const OrderSchema = new Schema({
  order_state: { type: String, require: true, enum: ['active', 'completed', 'pending', 'failed'], default: 'active' },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, OrderSchema);
