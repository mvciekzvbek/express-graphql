import { ApolloServer } from 'apollo-server';

const typeDefs = `
    type Query {
        totalArticles: Int!
    }

    type Mutation {
        postArticle(
            title: String!
            lead: String
            content: String!
        ): Boolean!
    }
`

const articles = [];

const resolvers = {
    Query: {
        totalArticles: () => articles.length
    },
    Mutation: {
        postArticle(parent, args) {
            articles.push(args)
            return true
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server
    .listen(3000)
    .then(({url}) => console.log(`GraphQL Service is running on ${url}`))