import SteamAuth from 'node-steam-openid';

export const steam = new SteamAuth({
    realm: import.meta.env.STEAM_OPENID_REALM,
    returnUrl: `${import.meta.env.STEAM_OPENID_REALM}/auth/steam/authenticate`,
    apiKey: import.meta.env.STEAM_API_KEY
})