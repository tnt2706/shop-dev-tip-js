const os = require('os');
const process = require('process');
const mongoose = require('mongoose');

const _SECONDS = 5000;

// Count connect
const countConnect = () => {
  const numberConnect = mongoose.connections.length;
  console.log(`Number of connections::${numberConnect}`);
};

// Check over load

const checkOverload = () => {
  setInterval(() => {
    const numberConnect = mongoose.connections.length;
    const cpuCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = cpuCores * 5;

    console.log(`Number of connections::${numberConnect}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024}`);

    if (numberConnect > maxConnections) {
      console.log('Connection overload detected !');
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
