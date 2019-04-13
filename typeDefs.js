import {gql} from 'apollo-server-express'

export const typeDefs = gql`
    scalar DateTime

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
        created: DateTime!
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

    type Query {
        totalArticles: Int!
        allArticles(after: DateTime, postedBy: ID): [Article!]
        totalUsers: Int!
        allUsers: [User!]
        me: User
    }

    type Mutation {
        postArticle(input: PostArticleInput!): Article!
        githubAuth(code: String!): AuthPayload!
        addFakeUsers(count: Int = 1): [User!]!
        fakeUserAuth(githubLogin: ID!): AuthPayload!
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Subscription {
        newArticle: Article!
        newUser: User!
    }
`