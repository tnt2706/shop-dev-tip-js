const amqplib = require('amqplib');

async function runProducerOrder() {
  const connection = await amqplib.connect('amqp://guest:tinhtran@localhost');
  const channel = await connection.createChannel();

  const queueName = 'ordered-queue-messages';

  // Create queue
  const queueResult = await channel.assertQueue(queueName, {
    durable: true,
  });

  for (let i = 0; i < 10; i += 1) {
    const msg = `${queueName}::${i}`;
    console.log(`sending::${msg}`);
    channel.sendToQueue(queueResult.queue, Buffer.from(msg), { persistent: true });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 1000);
}

(async () => {
  await runProducerOrder();
})();
