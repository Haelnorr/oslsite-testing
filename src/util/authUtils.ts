import { srlm_post } from "./srlmUtils";

export async function verify_user(token: string) {
    return await srlm_post('/auth/user/validate', token);
}

export function set_cookies(Astro, user_token) {


    Astro.cookies.set('user_token', user_token.token, { 
        maxAge: 60480000,
        httpOnly: true,
        path: '/'
    })
    Astro.cookies.set('token_expiry', user_token.expires, { 
        maxAge: 604800,
        httpOnly: true,
        path: '/'
    })

    return Astro.redirect('/profile');
}