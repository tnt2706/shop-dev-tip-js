const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const DiscountSchema = new Schema({
  discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

  discount_name: { type: String, require: true },
  discount_description: { type: String, require: true },
  discount_type: { type: String, default: 'fixed_amount' }, // percentage
  discount_value: { type: Number, require: true },
  discount_code: { type: String, require: true },
  discount_start_date: { type: Date, require: true },
  discount_end_date: { type: Date, require: true },
  discount_max_users: { type: Number, require: true },
  discount_uses_count: { type: Number, require: true },
  discount_users_used: { type: Array, default: [] },
  discount_max_uses_per_user: { type: Number, require: true },
  discount_min_order_value: { type: Number, require: true },

  discount_is_active: { type: Boolean, default: true },
  discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] },
  discount_product_ids: { type: Array, default: [] },

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

module.exports = model(DOCUMENT_NAME, DiscountSchema);
