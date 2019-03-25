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
        client: '3d68acc66b2cb10108f6',
        client_secret: 'd2a390397b5709238a8638dc5ae9aff751de96c5',
        code
    })

    if (message) {
        throw new Error(message);
    }

    let latestUserInfo = {
        name,
        githubLogin,
        githubToken,
        avatar: avatar_url
    }

    const { ops:[user] } = await db
        .collection('users')
        .replaceOne({githubLogin: login}, latestUserInfo, { upsert: true})

    return { user, token, access_token }
}

export {
    postArticle,
    githubAuth
}