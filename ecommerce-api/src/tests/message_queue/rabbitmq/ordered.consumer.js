const amqplib = require('amqplib');

async function runConsumerOrder() {
  const connection = await amqplib.connect('amqp://guest:tinhtran@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queue-messages';

  // Create queue
  const queueResult = await channel.assertQueue(queueName, {
    durable: true,
  });

  // Set prefetch to 1 to ensure that only 1 ack at a time
  channel.prefetch(1);

  channel.consume(queueResult.queue, msg => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(`processed::${message}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

(async () => {
  await runConsumerOrder();
})();
