import express from 'express';
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors';

import schema from '../graphql';

const app = express();
app.use(cors());

console.log(process.env.NODE_ENV);

const port = process.env.NODE_ENV ? 80 : 3000;

const server = new ApolloServer({
    schema
})

server.applyMiddleware({app});

app.get('/', (req, res) => {
    res.end('Welcome to notogo API');
})

app.listen(port, () => {
    console.log(`GraphQL Server running @ http://localhost:${port}${server.graphqlPath}`);
});
