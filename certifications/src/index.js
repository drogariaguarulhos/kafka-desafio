import {Kafka, logLevel} from 'kafkajs';
import md5 from 'md5';
import {v4 as uuidV4} from 'uuid';

const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
  retry: {
      initialRetryTime: 300,
      retries: 10
  },
  logLevel: logLevel.NOTHING
});

const topic = 'test-topic';
const consumer = kafka.consumer({ groupId: 'sender' });
const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true  })
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const aluno = JSON.parse(message.value);
        console.log(message.value.toString());
        setTimeout( async ()=>{
          const certificade = {
            id: uuidV4(),
            hash: md5(`${message.value.toString()}`),
            message: `O Aluno ${aluno.user.name} paerticipou do curso ${aluno.course} com a nota final ${aluno.grade}.`
          }
          await producer.send({
            topic: 'test-recive',
            messages: [
              {
                key: 'Certificate',
                value: JSON.stringify(certificade)
              }
            ]
          });
        }, 3000);
      },
    });
}

run().catch(console.error);