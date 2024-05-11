import axios from "axios";

type DiscordToken = {
    access_token: string,
    refresh_token: string,
    expires_in: number,
    scope: string,
    token_type: string
}

export async function getTokens(code:string): Promise<DiscordToken> {
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

export type DiscordUser = {
    id: string,
    username: string,
    avatar: string,
    discriminator: string,
    public_flags: number,
    flags: number,
    //banner: null,
    //accent_color: null,
    global_name: string,
    //avatar_decoration_data: null,
    //banner_color: null,
    //clan: null,
    mfa_enabled: boolean,
    locale: string,
    premium_type: number,
    email: string,
    verified: boolean
  }

export async function getUser(access_token:string): Promise<DiscordUser> {

    return await axios.get('https://discord.com/api/users/@me', {
    headers: {
        Authorization: `Bearer ${access_token}`
    }
    }).then((response) => response.data);
}

export async function refreshToken(refreshToken: string): Promise<DiscordToken> {    
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
    ).then((response) => response.data);
}