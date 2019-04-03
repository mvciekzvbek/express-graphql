import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import resolvers from './resolvers';
import { typeDefs } from './typeDefs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function start () {

    const app = express();
    const MONGO_DB = 'mongodb://mongo/blog';
    let db;


    try {
        const client = await MongoClient.connect(MONGO_DB, { useNewUrlParser: true });
        db = client.db();
      } catch (error) {
        console.log(`
        
            Mongo DB Host not found!
            please add DB_HOST environment variable to .env file
            exiting...
           
        `)
        process.exit(1);
    }

    const server = new ApolloServer({ 
        typeDefs, 
        resolvers, 
        context: async ({req}) => {

            // console.log(req.headers);

            const githubToken = req.headers.authorization;

            // console.log(githubToken);
            const currentUser = await db.collection('users').findOne({githubToken})
            // console.log(currentUser);
            return { db, currentUser}
        }
    });



    server.applyMiddleware({app});

    app.get('/', (req,res) => res.end('Welcome to my blog!'));

    app.get('/playground', expressPlayground({ endpoint: '/graphql'}));

    app.listen({port: 3000}, () => console.log(`GraphQL Server running at http://localhost:3000${server.graphqlPath}`));
}

start()