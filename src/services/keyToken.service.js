const { KeyToken } = require('../models');

async function createKeyToken({ shopId, publicKey, privateKey }) {
  try {
    const token = KeyToken.create({ user: shopId, publicKey, privateKey });

    return token ? publicKey : null;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createKeyToken,
};
