/* eslint-disable camelcase */

/**
  Key features
  - add product to cart [User]
  - reduce product quantity by one [User]
  - increase product quantity by one [User]
  - get cart [User]
  - delete cart [User]

 */

const { Cart } = require('../models');

const { findCartByUser, upsertProductToCart } = require('../models/repositories/cart.repo');

class CartService {
  static async addToCart({ userId, product }) {
    const { productId, quantity } = product;

    const foundCart = await findCartByUser(userId);
    if (!foundCart) {
      const newCart = await upsertProductToCart({ userId, product, count_product: 1 });
      return newCart;
    }

    const { _id: cartId, cart_products = [], cart_count_product } = foundCart;

    const index = cart_products.findIndex(p => p.productId == productId);
    if (index < 0) {
      const updateCart = await upsertProductToCart({ userId, product, count_product: cart_count_product + 1 });
      return updateCart;
    }

    cart_products[index].quantity = quantity;
    return await Cart.findByIdAndUpdate(cartId, { cart_products }, { new: true }).lean();
  }
}

module.exports = CartService;
