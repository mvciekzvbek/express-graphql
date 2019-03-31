import { authorizeWithGithub } from "../utlis/utils";

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
        client_id: '3d68acc66b2cb10108f6',
        client_secret: '69678a5d81a9ae01e1f417af31fb5c541896fe15',
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