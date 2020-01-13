const newArticle = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('newArticle'),
};

const newUser = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('newUser'),
};

const newComment = {
  subscribe: (parent, args, { pubsub }) => pubsub.asyncIterator('newComment'),
}

export {
  newArticle,
  newUser,
  newComment
};
