import { ApolloServer, PubSub } from 'apollo-server-express';
import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
import { createServer } from 'http';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { performance } from 'perf_hooks';
import { typeDefs } from './typeDefs';
import resolvers from './resolvers';
import 'dotenv/config';
import db from './utlis/db';

async function start() {
  const app = express();
  const pubsub = new PubSub();

  db.connect(() => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      validationRules: [
        depthLimit(5),
        createComplexityLimitRule(3000, {
          onCost: cost => console.log('query cost: ', cost),
        }),
      ],
      context: async ({ req, connection }) => {
        const githubToken = req
          ? req.headers.authorization
          : connection.context.Authorization;

        const currentUser = await db.get()
          .collection('users')
          .findOne({ githubToken });

        return {
          db,
          currentUser,
          pubsub,
          timestamp: performance.now(),
        };
      },
    });

    server.applyMiddleware({ app });

    app.get('/', (req, res) => res.end('Welcome to my blog!'));

    app.get('/playground', expressPlayground({ endpoint: '/graphql' }));

    app.listen({ port: 3000 }, () => console.log(`GraphQL Server running at http://localhost:3000${server.graphqlPath}`));

    const httpServer = createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.timeout = 5000;

    httpServer.listen({ port: 4000 }, () => console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`));
  });
}

start();
