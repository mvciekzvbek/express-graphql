const newArticle = {
    subscribe: (parent, args, {pubsub}) => 
        pubsub.asyncIterator('article-added')   
}

const newUser = {
    subscribe: (parent, args, {pubsub}) =>
        pubsub.asyncIterator('user-added')
}

export {
    newArticle,
    newUser
}