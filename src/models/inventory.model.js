const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const InventorySchema = new Schema({
  inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

  inven_location: { type: String, default: 'unKnow' },
  inven_stock: { type: String, require: true },
  inven_reservations: { type: Array, default: [] },

  /**
   * cartId
   * stock
   * createdOn
   */
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, InventorySchema);
