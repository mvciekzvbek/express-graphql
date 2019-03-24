import { GraphQLScalarType } from 'graphql'

const Article = {
    url: parent => `http://example.com/article/${parent.id}`,
    postedBy: parent => {
        return users.find(u => u.githubLogin === parent.gihubUser)
    }
}

const User = {
    postedArticles: parent => {
        return articles.filter(a => a.gihubUser === parent.githubLogin)
    }
}

const DateTime = new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
})

export {
    Article,
    User,
    DateTime
}