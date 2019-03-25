const totalArticles = (parent, args, { db }) => 
    db.collection('articles')
        .estimatedDocumentCount()

const allArticles = (parent, args, { db }) => 
    db.collection('articles')
        .find()
        .toArray()

const totalUsers = (parent, args, { db }) => 
    db.collection('users')
        .estimatedDocumentCount()

const allUsers = (parent, args, { db }) =>
    db.collection('users')
        .find()
        .toArray()

export {
    totalArticles,
    allArticles,
    totalUsers,
    allUsers
}