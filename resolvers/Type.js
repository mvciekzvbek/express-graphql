import { GraphQLScalarType } from 'graphql'

const Article = {
    id: parent => parent.id || parent._id,
    url: parent => {
        return `/articles/${parent._id}`
    },
    authors: (parent, args, {db}) => {
        return db.get().collection('users')
            .find({githubLogin: parent.userID})
            .toArray()
    },
    categories: async (parent, args, {db}) => {
        let categoriesToDisplay = [];

        for (let id of parent.categories) {
            const category = await db.get().collection('categories')
                .findOne({_id: id})
            categoriesToDisplay.push(category);
        }

        return categoriesToDisplay;
    }
}

const User = {
    id: parent => parent.id || parent._id,
    articles: (parent, args, {db}) => {
        return db.get().collection('articles')
            .find({"userID": parent.githubLogin})
            .toArray()
    }
}

const Category = {
    id: parent => parent.id || parent._id,
    articles: (parent, args, {db}) => {
        return db.get().collection('articles')
            .find({"categories": parent._id})
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
    Category,
    DateTime
}