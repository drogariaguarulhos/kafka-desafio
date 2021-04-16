import express from "express";
import {Kafka} from 'kafkajs';
import routes from "./routes";

const app = express();

app.use(express.json());

const kafka = new Kafka({
    clientId: 'api',
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
});

const producer = kafka.producer();

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
}

run().catch(console.error);


