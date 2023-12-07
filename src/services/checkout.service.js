/* eslint-disable no-empty-function */
/* eslint-disable camelcase */
/* eslint-disable no-await-in-loop */
const { BadRequestError } = require('../core/error.response');
const { Order } = require('../models');

const { findCartById } = require('../models/repositories/cart.repo');
const { updateReversionInventoryAfterOrder } = require('../models/repositories/inventory.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquiredLock, releaseLock } = require('./redis.service');

class CheckoutService {
  /*
    Apply checkout review

    cartId,
    userId,
    shop_order_ids:[
      {
        shopId,
        shop_discount:[
          {
            shopId,
            discountId,
            codeId
          }
        ],
        item_products: [
          {
            productId,
            shopId,
            quantity,
            price,
          }
        ]
      }
    ]
    */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError('Cart not exists');
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    const lenOrder = shop_order_ids.length;
    for (let i = 0; i < lenOrder; i += 1) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
      const checkoutProductServer = await checkProductByServer(item_products);
      const filterCheckoutProduct = checkoutProductServer.map(c => c);
      if (checkoutProductServer.length !== filterCheckoutProduct.length) {
        throw new BadRequestError('Order wrong!');
      }

      const checkoutPrice = checkoutProductServer.reduce((total, acc) => total + acc.price * acc.quantity, 0);
      checkout_order.totalPrice = checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkoutProductServer,
      };

      if (shop_discounts.length) {
        // Every shop only have one discount
        const { discount = 0 } = await getDiscountAmount({
          userId,
          shopId,
          products: item_products,
          codeId: shop_discounts[0].codeId,
        });

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
          checkout_order.totalDiscount += discount;
          checkout_order.totalCheckout += checkoutPrice - discount;
        }

        shop_order_ids_new.push(itemCheckout);
      }
    }

    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new,
    };
  }

  static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {
    const checkoutOrder = await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });
    const { checkout_order, shop_order_ids_new } = checkoutOrder;

    const products = shop_order_ids_new.flatMap(order => order.item_products);

    const productLength = products.length;
    const acquireProducts = [];

    for (let i = 0; i < productLength; i += 1) {
      const { productId, quantity } = products[i];
      const keyLock = await acquiredLock({ productId, quantity, cartId });
      acquireProducts.push(!!keyLock);

      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProducts.includes(false)) {
      throw BadRequestError('Some products are updated. Please return to the shopping cart');
    }

    const order = await Order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shopping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    if (order) {
      // remove quantity and inven_reservations
      updateReversionInventoryAfterOrder(cartId);
    }

    return order;
  }

  static async cancelOrderByUser() {

  }

  static async updateOrderStatusByUser() {

  }

  // QUERY ///

  static async getOrderByUser() {

  }

  static async getOrdersByUser() {

  }
}

module.exports = CheckoutService;
