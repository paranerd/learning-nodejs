# Apache Kafka with NodeJS

This is a simple demo setup to connect NodeJS to Apache Kafka.

## How to

1. Start the container

    ```bash
    docker compose up -d
    ```

1. Create a topic

    ```bash
    docker exec kafka /opt/kafka/bin/kafka-topics.sh --create --topic my-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
    ```

1. Install dependencies

    ```bash
    npm install
    ```

1. Start the consumer

    ```bash
    node src/consumer.js
    ```


1. Start the producer (in another terminal!)

    ```bash
    node src/producer.js
    ```
