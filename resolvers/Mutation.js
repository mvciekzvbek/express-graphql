import { authorizeWithGithub } from "../utlis/utils";
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const postArticle = async (parent, args, {db, currentUser, pubsub}) => {
    
    if (!currentUser) {
        throw new Error('only an authorized user can post an article');
    }

    const newArticle = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date()
    }

    const { insertedId } = await db.collection('articles').insertOne(newArticle);

    newArticle.id = insertedId;

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
        avatar: avatar_url
    }

    const { ops:[user], result } = await db
        .collection('users')
        .replaceOne({githubLogin: login}, latestUserInfo, { upsert: true})

    result.upserted && pubsub.publish('user-added', {newUser: user})    

    return { user, token: access_token }
}

const addFakeUsers = async (root, {count}, {db, pubsub}) => {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`

    const { results } = await fetch(randomUserApi).then(res => res.json())

    const users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }))

    await db.collection('users').insertMany(users)

    let newUsers = await db.collection('users')
        .find()
        .sort({_id: -1})
        .limit(count)
        .toArray()

    newUsers.forEach(newUser => pubsub.publish('user-added', {newUser}));

    return users
}

const fakeUserAuth = async (parent, {githubLogin}, {db}) => {
    const user = await db.collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin "${githubLogin}"`)
    }

    return {
      token: user.githubToken,
      user
    }
}

export {
    postArticle,
    githubAuth,
    addFakeUsers,
    fakeUserAuth
}