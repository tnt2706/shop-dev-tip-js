/* eslint-disable camelcase */
const { Discount } = require('../models');
const { BadRequestError, NotFoundError, ErrorResponse } = require('../core/error.response');

const DiscountValidation = require('../validation/discount.validation');
const { findDiscountCodeByShop, findAllDiscountCodeByShop } = require('../models/repositories/discount.repo');
const { findAllProducts } = require('../models/repositories/product.repo');

class DiscountService {
  constructor(payload) {
    const {
      discount_shopId, discount_name, discount_description,
      discount_type, discount_value, discount_code, discount_start_date,
      discount_end_date, discount_max_users, discount_uses_count, discount_users_used,
      discount_max_uses_per_user, discount_min_order_value, discount_applies_to,
      discount_product_ids,
    } = payload;

    this.discount_shopId = discount_shopId;
    this.discount_name = discount_name;
    this.discount_description = discount_description;
    this.discount_type = discount_type;
    this.discount_value = discount_value;
    this.discount_code = discount_code;
    this.discount_start_date = discount_start_date;
    this.discount_end_date = discount_end_date;
    this.discount_max_users = discount_max_users;
    this.discount_uses_count = discount_uses_count;
    this.discount_users_used = discount_users_used || [];
    this.discount_max_uses_per_user = discount_max_uses_per_user;
    this.discount_min_order_value = discount_min_order_value;
    this.discount_applies_to = discount_applies_to;
    this.discount_product_ids = discount_product_ids || [];
  }

  static async createDiscount({
    shopId, name, description, type, value, code, start_date, end_date, max_users,
    uses_count, users_used, max_uses_per_user, min_order_value, applies_to, product_ids,
  }) {
    const errMessages = new DiscountValidation({ discount_start_date: start_date, discount_end_date: end_date })
      .validateTime()
      .build();

    if (errMessages.length) {
      throw new BadRequestError('Input incorrect !');
    }

    const fountDiscount = await findDiscountCodeByShop({ code, shopId });
    if (fountDiscount) {
      throw new BadRequestError('Discount exists !');
    }

    const newDiscount = await Discount.create({
      discount_shopId: shopId,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_users: max_users,
      discount_uses_count: uses_count,
      discount_users_used: users_used || [],
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids || [],
    });

    return newDiscount;
  }

  static async updateDiscount() {}

  static async getAllDiscountWithProduct({ code, shopId, limit, page }) {
    const fountDiscount = await findDiscountCodeByShop({ code, shopId });
    if (!fountDiscount) {
      throw new NotFoundError('Discount not found !');
    }

    const { discount_applies_to, discount_product_ids } = fountDiscount;

    const filter = { product_shop: shopId };
    if (discount_applies_to === 'specific') {
      filter._id = { $in: discount_product_ids };
    }

    const products = await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name'],
    });

    return products;
  }

  static async getAllDiscountByShop({ shopId, limit, page }) {
    const filter = {
      discount_shopId: shopId,
      discount_is_active: true,
    };

    const discount = await findAllDiscountCodeByShop({ filter, limit, page, unSelect: ['__v'] });
    return discount;
  }

  /*
    Apply discount code

    products:[
      {
        productId,
        shopId,
        quantity,
        price
      }
    ]
    */

  static async getDiscountAmount({ codeId, products = [], userId, shopId }) {
    const foundDiscount = await findDiscountCodeByShop({ code: codeId, shopId });
    if (!foundDiscount) {
      throw new NotFoundError('Discount not found !');
    }

    const { discount_min_order_value, discount_type, discount_value } = foundDiscount;

    const errMessages = new DiscountValidation({ ...foundDiscount, userId })
      .checkExpire()
      .checkAvailable()
      .checkMaxUserPerDiscount()
      .build();

    if (errMessages.length) {
      throw new BadRequestError(errMessages[0]);
    }

    const totalOrder = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

    if (discount_min_order_value) {
      if (totalOrder < discount_min_order_value) {
        throw new ErrorResponse(`Discount requires a minimum order value of ${discount_min_order_value}`);
      }
    }

    const discountAmount = discount_type === 'fixed_amount' ? discount_value : totalOrder * discount_value / 100;

    return {
      totalOrder,
      discount: discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }
}

module.exports = DiscountService;
