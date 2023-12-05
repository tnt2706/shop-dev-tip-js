const Cart = require('../cart.model');

const { unGetSelectData } = require('../../utils');

const findCartByUser = async userId => {
  const cart = Cart.findOne({ cart_userId: userId })
    .select(unGetSelectData(['__v']))
    .lean();

  return cart;
};

const upsertProductToCart = async ({ product, userId, count_product }) => {
  const updateOrUpsert = {
    $addToSet: { cart_products: product },
    cart_count_product: count_product,
  };

  const newCart = await Cart.findOneAndUpdate({ cart_userId: userId }, updateOrUpsert, { new: true, upsert: true })
    .select(unGetSelectData(['__v']))
    .lean();

  return newCart;
};

module.exports = {
  findCartByUser,
  upsertProductToCart,
};
