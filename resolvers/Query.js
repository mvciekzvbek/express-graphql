const articlesCount = async (parent, args, { db }) => 
    await db.get().collection('articles')
        .estimatedDocumentCount()

const allArticles = async (parent, args, { db }) => {
    const { filter, paging, sorting } = args,
        createdFilterStart = filter && filter.createdBetween && filter.createdBetween.start || new Date('1/1/1'),
        createdFilterEnd =  filter && filter.createdBetween && filter.createdBetween.end || new Date('1/1/2099'),
        searchText = filter && filter.searchText,
        sortBy = sorting && sorting.sortBy || 'created_at';

    var sort = {};
    sort[sortBy] = -1;

    let result;
    if (filter && filter.categories.length > 0 && !searchText && !filter.id) {
        // filter by categories only
        let categories = [];
        for (let item of filter.categories) {
            const category = await db.get()
                .collection('categories')
                .findOne({name: item});
    
            categories.push(category["_id"])
        }

        result = await db.get().collection('articles')
            .find({
                categories: {
                    $in: categories
                },
                "created_at": {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                }
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else if (filter && filter.categories.length === 0 && !searchText && filter.id) {
        // filter by id only
        result = await db.get().collection('articles')
            .find({
                "created_at": {
                    $gt: createdFilterStart,
                    $lt: createdFilterEnd
                },
                _id: parseInt(filter.id, 10)
            })
            .limit(paging.first)
            .skip(paging.start)
            .sort(sort)
            .toArray()
    } else if (filter && filter.categories.length === 0 && searchText && !filter.id) {
         // filter by searchtext only
         result = await db.get().collection('articles')
         .find({
             "created_at": {
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
    } else if((!filter || filter.categories.length === 0) && searchText && filter.id) {
        // filter by search text && id
        result = await db.get().collection('articles')
            .find({
                "created_at": {
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
    } else {
        result = await db.get().collection('articles')
            .find({
                "created_at": {
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

const usersCount = async (parent, args, { db }) => 
    await db.get().collection('users')
        .estimatedDocumentCount()

const allUsers = async (parent, args, { db }) => {
    const {filter, paging, sorting} = args;

    if (filter && filter.id) {
        return await db.get().collection('users')
            .find({_id: parseInt(filter.id,10)})
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

const allCategories = async (parent, args, { db }) => {
    const {filter, paging, sorting} = args;

    const id = filter && filter.id;
    const name = filter && filter.name;

    if (id && !name) {
        return await db.get().collection('categories')
            .find({"_id": parseInt(id,10)})
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    } else if (!id && name) {
        return await db.get().collection('categories')
            .find({"name": name})
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    } else if (id && name) {
        return await db.get().collection('categories')
            .find({
                $and: [
                    {"_id": parseInt(id,10)},
                    {"name": name}
                ]
            })
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    } else {
        return await db.get().collection('categories')
            .find()
            .skip(paging.start)
            .limit(paging.first)
            .toArray()
    }
}

const me = (parent, args, {currentUser}) => currentUser

export {
    articlesCount,
    allArticles,
    usersCount,
    allUsers,
    allCategories,
    me
}