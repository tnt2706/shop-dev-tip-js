require('./global');

const consumerQueueService = require('./src/services/consumerQueue.service');

(async () => {
  await consumerQueueService.consumerToQueueNormal();
  await consumerQueueService.consumerToQueueFailed();
})();
