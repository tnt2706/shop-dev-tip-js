const slugify = require('slugify');
const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const ProductSchema = new Schema({
  product_name: { type: String, require: true },
  product_thumb: { type: String, require: true },
  product_slug: { type: String, require: true },
  product_description: { type: String, require: true },
  product_price: { type: Number, require: true },
  product_quantity: { type: Number, require: true },
  product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  product_attributes: { type: Schema.Types.Mixed, require: true },
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be above 1.0'],
  },
  product_variations: { type: Array, default: [] },

  isDraft: { type: Boolean, default: true, index: true, select: false },
  isPublished: { type: Boolean, default: false, index: true, select: false },
},
{
  timestamps: true,
  collection: COLLECTION_NAME,
});

// Create index for search
ProductSchema.index({ product_name: 'text', product_description: 'text' });

// Document middleware: run before .save() and .create ...
ProductSchema.pre('save', next => {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const ClothingSchema = new Schema({
  brand: { type: String, require: true },
  size: { type: String, require: true },
  material: { type: String, require: true },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
},
{
  timestamps: true,
  collection: 'Clothes',
});

const ElectronicSchema = new Schema({
  manufacture: { type: String, require: true },
  size: { type: Number, require: true },
  material: { type: String, require: true },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
},
{
  timestamps: true,
  collection: 'Electronics',
});

module.exports = {
  Product: model(DOCUMENT_NAME, ProductSchema),
  Clothing: model('Clothing', ClothingSchema),
  Electronic: model('Electronic', ElectronicSchema),
};
