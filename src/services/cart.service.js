/* eslint-disable camelcase */

/**
  Key features
  - add product to cart [User]
  - reduce product quantity by one [User]
  - increase product quantity by one [User]
  - get cart [User]
  - delete cart [User]

 */

const { BadRequestError } = require('../core/error.response');
const { Cart } = require('../models');

const { findProductById } = require('../models/repositories/product.repo');
const { findCartByUser, upsertProductToCart, upsertUserCartQuantity } = require('../models/repositories/cart.repo');

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

    cart_products[index].quantity += quantity;
    return await Cart.findByIdAndUpdate(cartId, { cart_products }, { new: true }).lean();
  }

  /*
    Apply discount code

    shop_order_ids:[
      {
        shopId,
        item_products: {
          productId,
          shopId,
          quantity,
          price,
          old_quantify
        }
      }
    ]
    */

  static async updateUserCart({ userId, shop_order_ids }) {
    const foundCart = await findCartByUser(userId);
    if (!foundCart) {
      throw new BadRequestError('Cart not exists');
    }

    const { shopId, item_products = {} } = shop_order_ids[0];
    const { productId, quantity, old_quantity } = item_products;

    const foundProduct = await findProductById({ product_id: productId, unselect: ['__v'] });
    if (!foundProduct) {
      throw new BadRequestError('Product not exists');
    }

    if (foundProduct.product_shop.toString() != shopId) {
      throw new BadRequestError('Product belong don\'t match with shop');
    }

    if (quantity === 0) {
      return await CartService.deleteUserCart({ userId, productId });
    }

    return await upsertUserCartQuantity({ userId, productId, quantity: quantity - old_quantity });
  }

  static async deleteUserCart({ userId, productId }) {
    const foundCart = await findCartByUser(userId);
    if (!foundCart) {
      throw new BadRequestError('Cart not exists');
    }

    return await Cart.findByIdAndUpdate(foundCart._id, { $pull: { cart_products: { productId } } }, { new: true }).lean();
  }

  static async listUserCart({ userId }) {
    return await findCartByUser(userId);
  }
}

module.exports = CartService;
