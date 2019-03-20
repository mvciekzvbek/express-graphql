import { ApolloServer } from 'apollo-server';

const typeDefs = `
    type Query {
        totalArticles: Int!
        allArticles: [Article!]
    }

    type Mutation {
        postArticle(input: PostArticleInput!): Article!
    }

    enum ArticleCategory {
        Javascript
        Python
        HTML5
        CSS3
        Java
        GraphQL
        Node
        React
        Redux
        Angular
        Architecture
        Microservices
        DevOps
        Docker
    }

    type Article {
        id: ID!
        title: String!
        lead: String!
        content: String!
        url: String!
        imageUrl: String
        categories: [ArticleCategory!]
        postedBy: User!
    }
    
    input PostArticleInput {
        title: String!
        lead: String!
        content: String!
        imageUrl: String
        categories: [ArticleCategory!] = []
    }

    type User {
        githubLogin: ID!
        name: String
        avatar: String
        postedArticles: [Article!]
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
                ...args.input
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