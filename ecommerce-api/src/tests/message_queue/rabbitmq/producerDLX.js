const amqplib = require('amqplib');

async function runProducer() {
  const connection = await amqplib.connect('amqp://guest:tinhtran@localhost');
  const channel = await connection.createChannel();

  const notificationExchange = 'notificationExchange';
  const notiQueue = 'notificationQueueProcess';
  const notificationExchangeDLX = 'notificationExchangeDLX';
  const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

  // Create exchange
  await channel.assertExchange(notificationExchange, 'direct', { durable: false });

  // Create queue
  const queueResult = await channel.assertQueue(notiQueue, {
    exclusive: false,
    deadLetterExchange: notificationExchangeDLX,
    deadLetterRoutingKey: notificationRoutingKeyDLX,
  });

  // bindQueue ( queue to  exchange) with queueResult.queue is name of queue "notificationQueueProcess"
  await channel.bindQueue(queueResult.queue, notificationExchange);

  // Send to message

  const message = 'A new product';

  await channel.sendToQueue(queueResult.queue, Buffer.from(message), { expiration: '10000' });

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 1000);
}

(async () => {
  await runProducer();
})();
