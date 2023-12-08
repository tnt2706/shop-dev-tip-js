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

      /**
        await channel.consume(notiQueue, mess => {
          logger.info('consumerToQueueNormal :: result', mess.content.toString());
          channel.ack(mess)
        }
       */

      // Create error TTL when producer send with TTL = 10s
      const timeExpire = 20000;

      setTimeout(async () => {
        await channel.consume(notiQueue, mess => {
          logger.info('consumerToQueueNormal :: result', mess.content.toString());
          channel.ack(mess);
        });
      }, timeExpire);
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
