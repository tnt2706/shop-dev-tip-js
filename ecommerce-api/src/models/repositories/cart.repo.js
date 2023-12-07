const Cart = require('../cart.model');

const { unGetSelectData } = require('../../utils');

const findCartByUser = async userId => {
  const cart = Cart.findOne({ cart_userId: userId, cart_state: 'active' })
    .select(unGetSelectData(['__v']))
    .lean();

  return cart;
};

const findCartById = async cartId => {
  const cart = Cart.findOne({ _id: cartId, cart_state: 'active' })
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

const upsertUserCartQuantity = async ({ userId, productId, quantity }) => {
  const query = {
    cart_userId: userId,
    'cart_products.productId': productId,
    cart_state: 'active',
  };

  const updateOrUpsert = {
    $set: {
      'cart_products.$.quantity': quantity,
    },
  };

  const newCart = await Cart.updateOne(query, updateOrUpsert)
    .select(unGetSelectData(['__v']))
    .lean();

  return newCart;
};

module.exports = {
  findCartByUser,
  findCartById,
  upsertProductToCart,
  upsertUserCartQuantity,
};
