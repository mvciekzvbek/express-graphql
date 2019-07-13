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

    input ArticleFilter {
        category: [ArticleCategory!]! = []
        createdBetween: DateRange
        searchText: String
        createdBy: String
        id: ID
    }

    input UserFilter {
        id: ID
        githubLogin: String
        name: String
    }

    input DateRange {
        start: DateTime
        end: DateTime
    }

    input DataPage {
        first: Int = 12
        start: Int = 0
    }

    enum SortDirection {
        ASCENDING
        DESCENDING
    }

    enum SortableArticleField {
        title
        created
        postedBy
        categories
    }

    enum SortableUserField {
        githubLogin
        name
    }

    input DataArticleSort {
        sort: SortDirection = DESCENDING
        sortBy: SortableArticleField = created
    }

    input DataUserSort {
        sort: SortDirection = DESCENDING
        sortBy: SortableUserField = githubLogin
    }

    type User {
        id: ID!
        githubLogin: ID!
        name: String
        avatar: String
        postedArticles: [Article!]
    }

    type Query {
        totalArticles: Int!
        allArticles(filter: ArticleFilter paging: DataPage = { first: 12, start: 0 } sorting: DataArticleSort = {sort: DESCENDING, sortBy: githubLogin }): [Article!]
        totalUsers: Int!
        allUsers(filter: UserFilter paging: DataPage = { first: 12, start: 0 } sorting: DataUserSort = {sort: DESCENDING, sortBy: githubLogin }): [User!]
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