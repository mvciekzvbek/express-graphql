
const prepareArticleFilter = async (db, filter) => {
  const start = filter && filter.createdBetween && filter.createdBetween.start || new Date('1/1/1993');
  const end = filter && filter.createdBetween && filter.createdBetween.end || new Date('1/1/2099');

  let query = {
    created_at: {
      $gt: start,
      $lt: end,
    }
  };

  if (filter && filter.categoriesByIds.length) {
    query.categories_ids = {
      $in: filter.categories
    }
  }

  if (filter && filter.categoriesByNames.length) {
    const categories = [];

    for (const name of filter.categoriesByNames) {
      const category = await db.get()
        .collection('categories')
        .findOne({ name: name });

      
      categories.push(category._id);
    }

    query.categories_ids = {
      $in: categories
    }
  }

  if (filter && filter.authorByName) {
    query.author_name = {
      $in: [filter.authorByName]
    }
  }

  if (filter && filter.authorById) {
    const author = await db.get()
        .collection('users')
        .findOne({ _id: filter.authorById });

    query.author_name = {
      $in: [author.githubLogin]
    }
  }

  if (filter && filter.id) {
    query._id = {
      $in: [parseInt(filter.id)]
    }
  } 

  if(filter && filter.text) {
    query.$text = {
      $search: filter.text
    }
  }

  return query;
};

const prepareUserFilter = (filter) => {
  let query = {};

  if (filter && filter.username) {
    query.githubLogin = {
      $in: [filter.username]
    }
  }

  if (filter && filter.id) {
    query._id = {
      $in: [parseInt(filter.id)]
    }
  } 
  
  return query;
}

const prepareCategoryFilter = (filter) => {
  const query = {};

  if (filter && filter.name) {
    query.name = {
      $in: [filter.name]
    }
  }

  if (filter && filter.id) {
    query._id = {
      $in: [parseInt(filter.id)]
    }
  } 

  return query;
}

export {
  prepareArticleFilter,
  prepareUserFilter,
  prepareCategoryFilter
}