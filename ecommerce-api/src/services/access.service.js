const _ = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Shop } = require('../models');

const { shopFindById } = require('./shop.service');
const keyTokenService = require('./keytoken.service');

const { createTokenPair } = require('../auth/authUtils');
const { BadRequestError, AuthFailureError, ForbiddenError, NotFoundError } = require('../core/error.response');

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
      throw new BadRequestError('ERROR: Shop already registered !');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await Shop.create({ email, name, password: hashPassword, roles: [RoleShop.SHOP] });

    return holderShop ? _.pick(newShop, ['_id', 'name', 'email']) : null;
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}

async function login({ email, password }) {
  try {
    const foundShop = await Shop.findOne({ email }).select('password name email').lean();
    if (!foundShop) {
      throw new BadRequestError('ERROR: Shop already registered !');
    }

    const { _id: userId } = foundShop;

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new BadRequestError('Password incorrect!');
    }

    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
    await keyTokenService.createKeyToken({ publicKey, privateKey, userId, refreshToken: tokens.refreshToken });

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
    await keyTokenService.removeKeyById(keyStore._id);
    return keyStore;
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}

async function handlerRefreshToken({ refreshToken, keyStore, user }) {
  try {
    const { userId, email } = user;
    const { refreshTokenUsed = [], privateKey, publicKey } = keyStore;

    if (refreshTokenUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyByUserId(userId);

      // Able send email alert
      throw new ForbiddenError('Something warning happen ! Please re-login');
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not register');
    }

    const foundShop = await shopFindById(userId);
    if (!foundShop) {
      throw new NotFoundError('Not found shop');
    }

    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey);
    await keyTokenService.updateRefreshToken(tokens.refreshToken, refreshToken);

    return {
      tokens,
      user: { userId, email },
    };
  } catch (error) {
    return { message: error.message, status: 'error' };
  }
}

module.exports = {
  signUp,
  login,
  logout,
  handlerRefreshToken,
};
