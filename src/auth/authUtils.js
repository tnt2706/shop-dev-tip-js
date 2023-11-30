const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
  const [accessToken, refreshToken] = await Promise.all([
    JWT.sign(payload, publicKey, { expiresIn: '2 days' }),
    JWT.sign(payload, privateKey, { expiresIn: '7 days' }),
  ]);

  JWT.verify(accessToken, publicKey, (error, decode) => {
    if (error) {
      console.error('Error verify::', error);
    } else {
      console.error('Decode verify::', decode);
    }
  });

  return { accessToken, refreshToken };
};

module.exports = {
  createTokenPair,
};
