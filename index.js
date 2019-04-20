import { ApolloServer, PubSub } from 'apollo-server-express';
import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import resolvers from './resolvers';
import { typeDefs } from './typeDefs';
import { MongoClient } from 'mongodb';
import { createServer } from 'http';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { performance } from 'perf_hooks';
import dotenv from 'dotenv';

dotenv.config();

async function start () {

    const app = express();
    const MONGO_DB = 'mongodb://mongo/blog';
    const pubsub = new PubSub();
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
        validationRules: [
            depthLimit(5),
            createComplexityLimitRule(1000, {
                onCost: cost => console.log('query cost: ', cost)
            })
        ],
        context: async ({req, connection}) => {
            const githubToken = req ? 
                req.headers.authorization :
                connection.context.Authorization

            const currentUser = await db
                .collection('users')
                .findOne({githubToken})

            return { 
                db, 
                currentUser, 
                pubsub, 
                timestamp: performance.now()}
        }
    });

    server.applyMiddleware({app});

    app.get('/', (req,res) => res.end('Welcome to my blog!'));

    app.get('/playground', expressPlayground({ endpoint: '/graphql'}));

    app.listen({port: 3000}, () => console.log(`GraphQL Server running at http://localhost:3000${server.graphqlPath}`));

    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.timeout = 5000;

    httpServer.listen({ port: 4000 }, () =>
        console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`)
    )
    
}

start();