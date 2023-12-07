const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
  const [accessToken, refreshToken] = await Promise.all([
    JWT.sign(payload, publicKey, { expiresIn: '2 days' }),
    JWT.sign(payload, privateKey, { expiresIn: '7 days' }),
  ]);

  JWT.verify(accessToken, publicKey, (error, decode) => {
    if (error) {
      console.error('Error verify::', error);
    }
  });

  return { accessToken, refreshToken };
};

const verifyJWT = async (token, secure) => {
  const verify = await JWT.verify(token, secure);
  return verify;
};

module.exports = {
  createTokenPair,
  verifyJWT,
};
