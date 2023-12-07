/* eslint-disable no-await-in-loop */
const { Promise } = require('mongoose');
const client = require('../dbs/init.redis');
const { updateReversionInventory } = require('../models/repositories/inventory.repo');

const acquiredLock = async ({ productId, quantity, cartId }) => {
  try {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTimes; i += 1) {
      const result = await client.SETNX(key, key);
      if (!result) {
        await new Promise(resolve => {
          setTimeout(() => resolve, 50);
        });
      } else {
        const modifiedCount = updateReversionInventory({ productId, quantity, cartId });
        if (modifiedCount) {
          await client.pExpire(key, expireTime);
          return key;
        }

        return null;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const releaseLock = async key => {
  await client.del(key);
};

module.exports = {
  acquiredLock,
  releaseLock,
};
