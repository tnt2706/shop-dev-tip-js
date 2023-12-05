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
const { BadRequestError, NotFoundError, ErrorResponse } = require('../core/error.response');

class CartService {
  constructor(payload) {
    const {

    } = payload;
  }

  static async addToCart({}) {

  }
}

module.exports = CartService;
