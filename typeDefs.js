import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar DateTime

    type Article {
        id: ID!
        title: String!
        lead: String!
        content: String!
        url: String!
        image_url: String
        categories: [Category!]
        author: User!
        created_at: DateTime!
    }

    type Category {
        id: ID!
        name: String!
        articles: [Article!]
        thumbnail: String
    }

    input PostArticleInput {
        title: String!
        lead: String!
        content: String!
        image_url: String
        categories: [String!]
    }

    input ArticleFilter {
        categoriesByNames: [String!] = []
        categoriesByIds: [Int!] = []
        createdBetween: DateRange
        text: String
        authorById: Int
        authorByName: String
        id: ID
    }

    input UserFilter {
        id: ID
        username: String
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
        avatar_url: String
        articles: [Article!]
    }

    type AllArticlesResult {
        hits: [Article!]!
        count: Int
    }

    type AllUsersResult {
        hits: [User!]!
        count: Int
    }

    type AllCategoriesResult {
        hits: [Category!]!
        count: Int
    }

    type Query {
        articlesCount: Int!
        allArticles(filter: ArticleFilter paging: DataPage = { first: 6, start: 0 } sorting: DataArticleSort = {sort: DESCENDING, sortBy: created_at}): AllArticlesResult!
        usersCount: Int!
        allUsers(filter: UserFilter paging: DataPage = { first: 30, start: 0 } sorting: DataUserSort = {sort: DESCENDING, sortBy: githubLogin }): AllUsersResult!
        allCategories(filter: CategoryFilter paging: DataPage = { first: 12, start: 0 } sorting: DataCategorySort = {sort: DESCENDING, sortBy: name }): AllCategoriesResult!,
        me: User
    }

    type Mutation {
        postArticle(input: PostArticleInput!): Article!
        githubAuth(code: String!): AuthPayload!
        addFakeUsers(count: Int = 1): [User!]!
        addCategory(name: String, thumbnail: String): Category!
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
`;
