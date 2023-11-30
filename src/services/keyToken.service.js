const { KeyToken } = require('../models');

async function createKeyToken({ shopId, publicKey }) {
  try {
    const publicKeyString = publicKey.toString();

    const token = KeyToken.create({ user: shopId, publicKey: publicKeyString });

    return token ? publicKeyString : null;
  } catch (error) {
    return error;
  }
}

module.exports = {
  createKeyToken,
};
