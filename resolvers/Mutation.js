const postArticle = (parent, args) => {
    
    var newArticle = {
        id: _id++,
        ...args.input,
        created: new Date()
    }

    articles.push(args)
    return newArticle
}

export {
    postArticle
}