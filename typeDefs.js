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
        categories: [Category!]
        authors: [User!]
        created: DateTime!
    }

    type Category {
        id: ID!
        name: ArticleCategory!
        articles: [Article!]
    }

    input PostArticleInput {
        title: String!
        lead: String!
        content: String!
        imageUrl: String
        categories: [ArticleCategory!] = []
    }

    input ArticleFilter {
        categories: [ArticleCategory!]! = []
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

    input CategoryFilter {
        id: ID
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
        authors
        categories
    }

    enum SortableUserField {
        githubLogin
        name
    }

    enum SortableCategoryField {
        id,
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

    input DataCategorySort {
        sort: SortDirection = DESCENDING
        sortBy: SortableCategoryField = name
    }

    type User {
        id: ID!
        githubLogin: ID!
        name: String
        avatar: String
        articles: [Article!]
    }

    type Query {
        articlesCount: Int!
        allArticles(filter: ArticleFilter paging: DataPage = { first: 12, start: 0 } sorting: DataArticleSort = {sort: DESCENDING, sortBy: title }): [Article!]
        usersCount: Int!
        allUsers(filter: UserFilter paging: DataPage = { first: 12, start: 0 } sorting: DataUserSort = {sort: DESCENDING, sortBy: githubLogin }): [User!],
        allCategories(filter: CategoryFilter paging: DataPage = { first: 12, start: 0 } sorting: DataCategorySort = {sort: DESCENDING, sortBy: name }): [Category!]!,
        me: User
    }

    type Mutation {
        postArticle(input: PostArticleInput!): Article!
        githubAuth(code: String!): AuthPayload!
        addFakeUsers(count: Int = 1): [User!]!
        addCategory(name: String): Category!
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