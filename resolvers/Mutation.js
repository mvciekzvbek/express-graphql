import { authorizeWithGithub } from "../utlis/utils";
import fetch from 'node-fetch';
import 'dotenv/config';

const postArticle = async (parent, args, {db, currentUser, pubsub}) => {

    if (!currentUser) {
        throw new Error('only an authorized user can post an article');
    }

    const id = await db.getNextSequence("articleid");
    let { input } = args;
    const categoriesNames = input.categories;
    let categoriesIds = [];

    for (let name of categoriesNames) {
        const category = await db.get()
            .collection('categories')
            .findOne({name: name});

        categoriesIds.push(category["_id"])
    }

    delete input.categories;

    const newArticle = {
        ...input,
        "_id": id,
        "author_name": currentUser.githubLogin,
        "created_at": new Date(),
        "categories_ids": categoriesNames
    }
    
    await db.get().collection('articles').insertOne(newArticle);

    pubsub.publish('article-added', {newArticle});

    return newArticle
}

async function githubAuth (parent, {code}, {db, pubsub}) {

    let {
        message,
        access_token,
        avatar_url,
        login,
        name
    } = await authorizeWithGithub({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code
    })

    if (message) {
        throw new Error(message);
    }

    let latestUserInfo = {
        name,
        githubLogin: login,
        githubToken: access_token,
        avatar_url: avatar_url
    }

    const isInDb = await db.get()
            .collection('users')
            .findOne({name: latestUserInfo.name});

    let usr;

    if (isInDb) {
        const { ops:[user] } = await db.get()
            .collection('users')
            .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true})
        usr = user;
    } else {
        const id = await db.getNextSequence("userid");
        latestUserInfo = {
            _id: id,
            ...latestUserInfo
        }

        const { ops:[user], result} = await db.get().collection('users').insertOne(latestUserInfo);
        usr = user;

        result.upserted && pubsub.publish('user-added', {newUser: usr})    
    }

    return { usr, token: access_token }
}

const addFakeUsers = async (root, {count}, {db, pubsub}) => {
    count = 1
    const randomUserApi = `https://randomuser.me/api/?results=${count}`

    const { results } = await fetch(randomUserApi).then(res => res.json())

    const id = await db.getNextSequence('userid');
    
    const users = results.map(r => ({
        "_id": id,
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar_url: r.picture.thumbnail,
        githubToken: r.login.sha1
    }))

    await db.get().collection('users').insertMany(users)

    let newUsers = await db.get().collection('users')
        .find()
        .sort({_id: -1})
        .limit(count)
        .toArray()

    newUsers.forEach(newUser => pubsub.publish('user-added', {newUser}));

    return users
}

const fakeUserAuth = async (parent, {githubLogin}, {db}) => {
    const user = await db.get().collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`)
    }

    return {
      token: user.githubToken,
      user
    }
}

const addCategory = async (parent, args, {db, currentUser}) => {
    if (!currentUser) {
        throw new Error('only an authorized user can post an article');
    }

    const id = await db.getNextSequence("categoryid");

    const newCategory = {
        "name": args.name,
        "_id": id,
    }

    await db.get().collection('categories').insertOne(newCategory);

    return newCategory;
}

export {
    postArticle,
    githubAuth,
    addFakeUsers,
    fakeUserAuth,
    addCategory
}