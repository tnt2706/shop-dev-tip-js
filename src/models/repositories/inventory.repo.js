const Inventory = require('../inventory.model');

const insertInventory = async ({ product_id, shop_id, stock }) => await Inventory.create({
  inven_productId: product_id,
  inven_shopId: shop_id,
  inven_location: 'unKnow',
  inven_stock: stock,
});

module.exports = {
  insertInventory,
};
