import { GraphQLScalarType } from 'graphql'

const Article = {
    id: parent => parent.id || parent._id,
    url: parent => {
        console.log(parent);
        return `http://example.com/articles/${parent._id}`
    },
    postedBy: (parent, args, {db}) => 
        db.collection('users').findOne({githubLogin: parent.userID})
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