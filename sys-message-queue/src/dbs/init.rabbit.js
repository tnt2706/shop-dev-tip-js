const amqplib = require('amqplib');

const { rabbitMq } = require('../configs');

const connectRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect(rabbitMq);
    const chanel = await connection.createChannel();

    return { chanel, connection };
  } catch (error) {
    logger.error('Error connecting Rabbit MQ', { error });
  }
};

module.exports = connectRabbitMQ;
