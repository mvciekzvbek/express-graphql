import { GraphQLScalarType } from 'graphql'

const Article = {
    id: parent => parent.id || parent._id,
    url: parent => {
        return `/articles/${parent._id}`
    },
    postedBy: (parent, args, {db}) => 
        db.get().collection('users').findOne({githubLogin: parent.userID})
}

const User = {
    id: parent => parent.id || parent._id,
    postedArticles: (parent, args, {db}) => {
        return db.get().collection('articles')
            .find({"userID": parent.githubLogin})
            .toArray()
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