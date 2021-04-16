import express from "express";
import {Kafka, logLevel} from 'kafkajs';
import routes from "./routes";

const app = express();

app.use(express.json());

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    },
    logLevel: logLevel.NOTHING
});

const producer = kafka.producer();
const topic = 'test-recive';
const consumer = kafka.consumer({ groupId: 'receiver' });

app.use((req, res, next) =>{
    req.producer = producer;
    return next();
});

app.use(routes);

const run = async ()=> {
    await producer.connect();
        
    app.listen(3333,()=>{
        console.log("Server Start in http://localhost:3333/");
    });
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true});
    
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(message.value.toString());
      },
    });
}

run().catch(console.error);


