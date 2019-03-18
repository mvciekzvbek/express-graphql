import { ApolloServer } from 'apollo-server';

const typeDefs = `
    type Query {
        totalArticles: Int!
        allArticles: [Article!]
    }

    type Mutation {
        postArticle(
            title: String!
            lead: String
            content: String!
            imageUrl: String
        ): Article!
    }

    type Article {
        id: ID!
        title: String!
        lead: String!
        content: String!
        url: String!
        imageUrl: String
    }
`
var _id = 0;
const articles = [];

const resolvers = {
    Query: {
        totalArticles: () => articles.length,
        allArticles: () => articles
    },
    Mutation: {
        postArticle(parent, args) {

            var newArticle = {
                id: _id++,
                ...args
            }

            articles.push(args)
            return newArticle
        }
    },
    Article: {
        url: parent => `http://example.com/article/${parent.id}`
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server
    .listen(3000)
    .then(({url}) => console.log(`GraphQL Service is running on ${url}`))