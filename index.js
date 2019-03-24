import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import expressPlayground from 'graphql-playground-middleware-express'
import { readFileSync } from 'fs'
import resolvers from './resolvers'

var typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')

var app = express();

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({app})

app.get('/', (req,res) => res.end('Welcome to my blog!'))

app.get('/playground', expressPlayground({ endpoint: '/graphql'}))

app.listen({port: 3000}, () => console.log(`GraphQL Server running at http://localhost:3000${server.graphqlPath}`))