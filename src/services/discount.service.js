const model = require('../models');
const { BadRequestError } = require('../core/error.response');

const { insertInventory } = require('../models/repositories/inventory.repo');

class DiscountService {
  constructor(product_type, payload) {
    const {
      product_name, product_thumb, product_description,
      product_price, product_quantity, product_attributes, product_shop,
    } = payload;

    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_type = product_type;
    this.product_attributes = product_attributes || [];
  }

  async createDiscountCode(productId) {

  }
}

module.exports = new DiscountService();
