/* eslint-disable no-await-in-loop */
const { BadRequestError } = require('../core/error.response');

const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

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
      freeShip: 0,
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
}

module.exports = CheckoutService;
