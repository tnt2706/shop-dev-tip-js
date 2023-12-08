const connectRabbitMQ = require('../dbs/init.rabbit');

const messageService = {
  consumerToQueue: async queueName => {
    try {
      const { channel, connection } = await connectRabbitMQ();
    } catch (error) {
      logger.error('consumerToQueue :: ERROR', { error });
    }
  },

  consumerToQueueNormal: async () => {
    try {
      const { channel } = await connectRabbitMQ();

      const notiQueue = 'notificationQueueProcess';

      // 1.TTL -  Create error TTL when producer send with TTL = 10s
      /*
      const timeExpire = 20000;

      setTimeout(async () => {
        await channel.consume(notiQueue, mess => {
          logger.info('consumerToQueueNormal :: result', mess.content.toString());
          channel.ack(mess);
        });
      }, timeExpire);
      */

      // 2. LOGIC

      await channel.consume(notiQueue, mess => {
        try {
          const numberRandom = Math.random();
          logger.info('numberRandom', { numberRandom });
          if (numberRandom < 0.8) {
            throw new Error('Send notification failed::: HOT FIX');
          }
          logger.info('consumerToQueueNormal :: result', mess.content.toString());
          channel.ack(mess);
        } catch (error) {
          /**
           * nack: negative acknowledgment
           * params 1: message
           * params 2: Sắp xếp lại hàng đợi hay không=> đưa lại về queue ban đầu
           * params 3: Reject many message
           */
          channel.nack(mess, false, false);
        }
      });
    } catch (error) {
      logger.error('consumerToQueueNormal :: ERROR', { error });
    }
  },

  consumerToQueueFailed: async () => {
    try {
      const { channel } = await connectRabbitMQ();

      const notificationExchangeDLX = 'notificationExchangeDLX';
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

      const notiQueueHandler = 'notificationQueueHotfix';

      // Create a exchange has name : notificationExchangeDLX
      await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });

      // Create a queue has name : notificationQueueHotfix
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false,
      });

      //  Bind exchange to queue : bindQueue(queue, source, routingKey)
      await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX);

      await channel.consume(queueResult.queue, mess => {
        logger.info('consumerToQueueFailed :: result', mess.content.toString());
      },
      {
        noAck: true,
      });
    } catch (error) {
      logger.error('consumerToQueueFailed :: ERROR', { error });
    }
  },
};

module.exports = messageService;
