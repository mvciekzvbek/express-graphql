const totalArticles = (parent, args, { db }) => 
    db.collection('articles')
        .estimatedDocumentCount()

const allArticles = (parent, args, { db }) => {
    const { filter, paging } = args;     
    const createdFilterStart = filter.createdBetween && filter.createdBetween.start ? filter.createdBetween.start : new Date('1/1/1');
    const createdFilterEnd = filter.createdBetween && filter.createdBetween.end ? filter.createdBetween.start : new Date('1/1/9999');


    return db.collection('articles')
        .find({
            categories: filter.category,
            created: {
                $gt: createdFilterStart,
                $lt: createdFilterEnd
            }
        })
        .limit(paging.first)
        .skip(paging.start)
        .toArray()
}

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