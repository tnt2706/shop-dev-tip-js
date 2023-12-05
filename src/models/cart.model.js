const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

const CartSchema = new Schema({
  cart_state: { type: String, require: true, enum: ['active', 'completed', 'pending', 'failed'], default: 'active' },
  cart_products: { type: Array, default: [], require: true },

  /*
    [
      {
        productId,
        shopId,
        quantity,
        name,
        price
      }
    ]
   */

  cart_count_product: { type: Number, default: 0 },
  cart_userId: { type: Schema.Types.ObjectId },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, CartSchema);
