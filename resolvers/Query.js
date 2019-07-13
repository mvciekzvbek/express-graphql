const totalArticles = async (parent, args, { db }) => 
    await db.get().collection('articles')
        .estimatedDocumentCount()

const allArticles = async (parent, args, { db }) => {
    const { filter, paging, sorting } = args,
        createdFilterStart = filter.createdBetween && filter.createdBetween.start || new Date('1/1/1'),
        createdFilterEnd =  filter.createdBetween && filter.createdBetween.end || new Date('1/1/2099'),
        searchText = filter.searchText;

    var sort = {};
    sort[sorting.sortBy] = -1;

    let result;
    /**
     * If there are category filters look for them
     * if not, do not apply category filter
     */
    if (filter && filter.category.length > 0 && searchText && filter.id) {
        result = await db.get().collection('articles')
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
                },
                _id: parseInt(filter.id, 10)
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else if((!filter || filter.category.length === 0) && searchText && filter.id){
        result = await db.get().collection('articles')
            .find({
                created: {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                },
                $text: { 
                    $search: filter.searchText
                },
                _id: parseInt(filter.id, 10)
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else if ((!filter || filter.category.length === 0) && !searchText && filter.id) {
        result = await db.get().collection('articles')
            .find({
                created: {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                },
                _id: parseInt(filter.id, 10)
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else {
        result = await db.get().collection('articles')
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

const totalUsers = async (parent, args, { db }) => 
    await db.get().collection('users')
        .estimatedDocumentCount()

const allUsers = async (parent, args, { db }) => {
    const {filter, paging, sorting} = args;

    if (filter) {
        return await db.get().collection('users')
            .find(filter)
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    } else {
        return await db.get().collection('users')
            .find()
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    }
}


const me = (parent, args, {currentUser}) => currentUser

export {
    totalArticles,
    allArticles,
    totalUsers,
    allUsers,
    me
}