const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const OrderSchema = new Schema({
  order_userId: { type: Schema.Types.ObjectId, require: true },

  /**
    order_checkout= {
      totalPrice,
      totalApplyDiscount,
      feeShip
    }
   */
  order_checkout: { type: Object, default: {} },

  /**
    order_shipping= {
      street,
      city,
      state,
      country
    }
   */
  order_shipping: { type: Object, default: {} },

  order_payment: { type: Object, default: {} },
  order_products: { type: Array, default: [] },
  order_trackingNumber: { type: String, default: '#0000118052022' },
  order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

module.exports = model(DOCUMENT_NAME, OrderSchema);
