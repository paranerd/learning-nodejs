const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'] // Connect to the Kafka broker running via Docker
});

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect();
  let i = 0;
  setInterval(async () => {
    try {
      await producer.send({
        topic: 'my-topic',
        messages: [
          { value: `Hello Kafka from Node.js! Message ${i++}` },
        ],
      });
      console.log(`Message ${i - 1} sent successfully!`);
    } catch (e) {
      console.error(`Error sending message: ${e.message}`, e);
    }
  }, 3000); // Send a message every 3 seconds
};

runProducer().catch(console.error);

process.on('SIGTERM', async () => {
  await producer.disconnect();
  console.log('Producer disconnected.');
});
