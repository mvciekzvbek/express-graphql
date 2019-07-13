import { MongoClient } from 'mongodb';
import 'dotenv/config';
let mongo;

const connect = (callback) => {
    MongoClient.connect(process.env.DB_HOST, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log(`
    
                Mongo DB Host not found!
                please add DB_HOST environment variable to .env file
                exiting...
    
            `)
            process.exit(1);
        } 

        mongo = client.db();
        callback();
    })
}

const get = () => mongo;

const close = () => mongo.close()

const getNextSequence = async (name) => {
    const ret = await mongo.collection('counters').findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { returnOriginal: false },
    )
    return ret.value.seq;
 }

export default {
    connect,
    get,
    close,
    getNextSequence
}