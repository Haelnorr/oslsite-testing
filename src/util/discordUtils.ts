import axios from "axios";

export async function getTokens(code:string) {
    const params = {
        client_id: import.meta.env.DISCORD_CLIENT_ID,
        client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: import.meta.env.DISCORD_REDIRECT_URI
    };

    return await axios.post(
        'https://discord.com/api/oauth2/token',
        params,
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    ).then((response) => response.data).catch((err) => err);
}

export async function getUser(access_token:string|undefined) {
    if(!access_token) {
        return {
            status_code: 401
        }
    }

    return await axios.get('https://discord.com/api/users/@me', {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
    }).then((response) => response.data).catch((err) => err);
}

export async function refreshToken(refreshToken) {    
    const params = {
        client_id: import.meta.env.DISCORD_CLIENT_ID,
        client_secret: import.meta.env.DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    };

    return await axios.post(
        'https://discord.com/api/oauth2/token',
        params,
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }
    ).then((response) => response.data).catch((err) => err);
}