import fetch from 'node-fetch';

const requestGithubToken = credentials => 
    fetch(
        'https://github.com/login/oauth/access_token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(credentials)
        }
    ).then(res => res.json())
    .catch(error => {
        throw new Error(JSON.stringify(error));
    })

const requestGithubUserAccount = token => { 
    console.log(token);
    return fetch(`https://api.github.com/user?access_token=${token}`)
    .then(res => res.json())
    .catch(error => {
        throw new Error(JSON.stringify(error));
    })
}
    

async function authorizeWithGithub (credentials) {
    console.log(credentials);
    const { access_token } = await requestGithubToken(credentials);

    console.log(access_token);

    const githubUser = await requestGithubUserAccount(access_token);
    return { ...githubUser, access_token };
}

export {
    authorizeWithGithub
}