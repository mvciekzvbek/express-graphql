import { authorizeWithGithub } from "../utlis/utils";
import dotenv from 'dotenv';

dotenv.config();

const postArticle = (parent, args) => {
    
    var newArticle = {
        id: _id++,
        ...args.input,
        created: new Date()
    }

    articles.push(args)
    return newArticle
}

async function githubAuth (parent, { code }, { db }) {

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

    const { ops:[user] } = await db
        .collection('users')
        .replaceOne({githubLogin: login}, latestUserInfo, { upsert: true})

    return { user, token: access_token }
}

export {
    postArticle,
    githubAuth
}