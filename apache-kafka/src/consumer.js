const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
        topic,
        partition,
      });
      // In a real application, you'd process the message here.
      // Ensure any processing is completed before considering the message "done".
    },
  });

  console.log('Consumer started. Press Ctrl+C to stop.');
};

// --- Graceful Shutdown Logic ---
const shutdown = async () => {
  console.log('\nReceived termination signal. Disconnecting consumer...');
  try {
    await consumer.disconnect();
    console.log('Consumer disconnected gracefully.');
    process.exit(0); // Exit successfully
  } catch (error) {
    console.error('Error during consumer shutdown:', error);
    process.exit(1); // Exit with an error code
  }
};

// Listen for SIGINT (Ctrl+C)
process.on('SIGINT', shutdown);

// Listen for SIGTERM (sent by processes like Docker, Kubernetes, etc. for graceful shutdown)
process.on('SIGTERM', shutdown);

// Start the consumer
runConsumer().catch(async (e) => {
  console.error('Error running consumer:', e);
  // If connection fails initially, disconnect and exit
  try {
    await consumer.disconnect();
  } catch (disconnectError) {
    console.error('Error during initial disconnect:', disconnectError);
  }
  process.exit(1);
});
