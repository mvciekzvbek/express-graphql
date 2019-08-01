import { GraphQLScalarType } from 'graphql'

const Article = {
    id: parent => parent.id || parent._id,
    url: parent => {
        return `/articles/${parent._id}`
    },
    author: (parent, args, {db}) => {
        return db.get().collection('users')
            .findOne({githubLogin: parent.author_name})
    },
    categories: async (parent, args, {db}) => {
        let categoriesToDisplay = [];

        for (let id of parent['categories_ids']) {
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
            .find({"author_name": parent.githubLogin})
            .toArray()
    }
}

const Category = {
    id: parent => parent.id || parent._id,
    articles: (parent, args, {db}) => {
        return db.get().collection('articles')
            .find({"categories_ids": parent._id})
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