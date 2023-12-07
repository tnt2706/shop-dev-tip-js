/* eslint-disable no-return-await */
const Inventory = require('../inventory.model');

const insertInventory = async ({ product_id, shop_id, stock }) => await Inventory.create({
  inven_productId: product_id,
  inven_shopId: shop_id,
  inven_location: 'unKnow',
  inven_stock: stock,
});

const updateReversionInventory = async ({ productId, quantity, cartId }) => {
  const filter = { inven_productId: productId, inven_stock: { $gte: quantity } };
  const updateSet = {
    $inc: { inven_stock: -quantity },
    $push: {
      inven_reservations: {
        quantity, cartId, createOn: new Date(),
      },
    },
  };

  const { modifiedCount } = await Inventory.updateOne(filter, updateSet);
  return modifiedCount;
};

const updateReversionInventoryAfterOrder = async cartId => {
  const filter = { 'inven_reservations.cartId': cartId };
  const updateSet = {
    $pull: {
      inven_reservations: { cartId },
    },
  };

  await Inventory.updateOne(filter, updateSet);
};

module.exports = {
  insertInventory,
  updateReversionInventory,
  updateReversionInventoryAfterOrder,
};
