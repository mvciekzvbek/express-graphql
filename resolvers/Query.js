const totalArticles = (parent, args, { db }) => 
    db.collection('articles')
        .estimatedDocumentCount()

const allArticles = (parent, args, { db }) => {
    const { filter, paging, sorting } = args,
        createdFilterStart = filter.createdBetween && filter.createdBetween.start ? filter.createdBetween.start : new Date('1/1/1'),
        createdFilterEnd = filter.createdBetween && filter.createdBetween.end ? filter.createdBetween.end : new Date('1/1/9999'),
        searchText = filter.searchText;

    var sort = {};
    sort[sorting.sortBy] = -1;

    let result;

    /**
     * If there are category filters look for them
     * if not, do not apply category filter
     */
    if (filter && filter.category.length > 0 && searchText) {
        result = db.collection('articles')
            .find({
                categories: {
                    $in: filter.category
                },
                created: {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                },
                $text: { 
                    $search: filter.searchText
                }
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else if((!filter || filter.category.length == 0) && searchText ){
        result = db.collection('articles')
            .find({
                created: {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                },
                $text: { 
                    $search: filter.searchText
                }
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else {
        result = db.collection('articles')
            .find({
                created: {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                }
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    }

    return result;
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