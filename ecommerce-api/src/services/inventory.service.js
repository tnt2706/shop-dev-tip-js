/* eslint-disable no-await-in-loop */
const { BadRequestError } = require('../core/error.response');
const { Inventory } = require('../models');

const { findProductById } = require('../models/repositories/product.repo');

class InventoryService {
  static async addStockToInventory({ stock, productId, shopId, location = 'HCM' }) {
    const product = await findProductById({ product_id: productId, unselect: ['__v'] });
    if (!product) {
      throw BadRequestError('The product dose not exists !');
    }

    const query = { inven_productId: productId, inven_shopId: shopId };
    const updateSet = {
      $inc: { inven_stock: stock },
      $set: {
        inven_location: location,
      },
    };

    const inventory = await Inventory.findOneAndUpdate(query, updateSet, { new: true, upsert: true }).lean();
    return inventory;
  }
}

module.exports = InventoryService;
