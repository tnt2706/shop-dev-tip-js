const _ = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Shop } = require('../models');

const { createTokenPair } = require('../auth/authUtils');
const keyTokenService = require('./keyToken.service');
const { BadRequestError } = require('../core/error.response')

const RoleShop = {
  SHOP: 'SHOP',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  WRITER: 'WRITER',
};

async function signUp({ name, email, password }) {
  try {
    const holderShop = await Shop.findOne({ email }).select('_id').lean();
    if (holderShop) {
      throw new BadRequestError('ERROR: Shop already registered !')
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await Shop.create({ email, name, password: hashPassword, roles: [RoleShop.SHOP] });
    if (newShop) {
      // create private key, public key

      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      const keyStore = await keyTokenService.createKeyToken({ publicKey, privateKey, shopId: newShop._id });
      if (!keyStore) {
        throw new BadRequestError('keyStory error')
      }

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      return {
        tokens,
        shop: _.pick(newShop, ['_id', 'name', 'email']),
      };
    }

    return null;
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}


async function login({ email, password, refreshToken = null }) {
  try {
    const foundShop = await Shop.findOne({ email }).select('password name email').lean();
    if (!foundShop) {
      throw new BadRequestError('ERROR: Shop already registered !')
    }

    const { _id: shopId } = foundShop

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new BadRequestError('Password incorrect!')
    }

    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair({ userId: shopId, email }, publicKey, privateKey);
    await keyTokenService.createKeyToken({ publicKey, privateKey, shopId, refreshToken: tokens.refreshToken });


    return {
      tokens,
      shop: _.pick(foundShop, ['_id', 'name', 'email']),
    };
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}

async function logout(keyStore) {
  try {
    await keyTokenService.removeKeyById(keyStore._id)
    return keyStore
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}
module.exports = {
  signUp,
  login,
  logout
};
