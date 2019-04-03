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

const me = (parent, args, {currentUser}) => currentUser

export {
    totalArticles,
    allArticles,
    totalUsers,
    allUsers,
    me
}