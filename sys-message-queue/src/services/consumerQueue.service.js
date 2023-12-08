const messageService = () => {
  async queueName => {
    try {

    } catch (error) {
      logger.error('consumerToQueue :: ERROR', { error });
    }
  };
};

module.exports = messageService;
