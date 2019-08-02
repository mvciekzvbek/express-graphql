import { prepareArticleFilter, prepareCategoryFilter, prepareUserFilter } from '../utlis/filters'

const articlesCount = async (parent, args, { db }) => await db.get().collection('articles')
  .estimatedDocumentCount();

const allArticles = async (parent, args, { db }) => {
  const { paging, sorting } = args;
  const filter = await prepareArticleFilter(db, args.filter);
  const sortBy = sorting && sorting.sortBy || 'created_at';
  const sort = {};
  sort[sortBy] = -1;

  console.log(sort);

  const articlesPromise = await db.get().collection('articles')
    .find(filter)
    .limit(paging.first)
    .skip(paging.start)
    .sort(sort)
    .toArray();

  const countPromise = db.get().collection('articles').countDocuments(filter);

  const [articles, count] = await Promise.all([articlesPromise, countPromise]);

  return {
    hits: articles, 
    count
  };
};

const usersCount = async (parent, args, { db }) => await db.get().collection('users')
  .estimatedDocumentCount();

const allUsers = async (parent, args, { db }) => {
  const { paging, sorting } = args;

  const filter = prepareUserFilter(args.filter);

  const usersPromise = await db.get().collection('users')
    .find(filter)
    .skip(paging.start)
    .limit(paging.first)
    .toArray();

  const countPromise = db.get().collection('users').countDocuments(filter);

  const [users, count] = await Promise.all([usersPromise, countPromise]);

  return {
    hits: users, 
    count
  };
};

const allCategories = async (parent, args, { db }) => {
  const { paging, sorting } = args;
  
  const filter = prepareCategoryFilter(args.filter)

  const categoriesPromise = await db.get().collection('categories')
    .find(filter)
    .skip(paging.start)
    .limit(paging.first)
    .toArray();

  const countPromise = db.get().collection('categories').countDocuments(filter);

  const [categories, count] = await Promise.all([categoriesPromise, countPromise]);

  return {
    hits: categories, 
    count
  };
};

const me = (parent, args, { currentUser }) => currentUser;

export {
  articlesCount,
  allArticles,
  usersCount,
  allUsers,
  allCategories,
  me,
};
