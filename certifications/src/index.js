import {Kafka} from 'kafkajs';
import {format} from 'date-fns'
const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092']
});

const topic = 'test-topic';
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${format(new Date(parseInt(message.timestamp)),'dd/MM/yyyy HH:mm:ss')}`
        console.log(`- ${prefix} ${message.key}#${message.value}`);
      },
    });
}

run().catch(console.error);