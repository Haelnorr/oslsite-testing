import { srlm_post } from "./srlmUtils";

export async function verify_user(token: string, perms:Array<string>=null) {
    if (perms) {
        var perms_resp = await srlm_post('/auth/user/validate', token, {perms:perms});
        if (perms_resp) {

            if (perms_resp === '503') {
                return perms_resp
            }

            var perms_list = {};
            perms_resp.has_perms.map(perm => {
                perms_list[perm[0]] = perm[1];
            })
            perms_resp['has_perms'] = perms_list;
            return perms_resp;
        } else {
            return null;
        }
        
    } else {
        return await srlm_post('/auth/user/validate', token);
    }
}

export function perms_has_one_of(user, perms: Array<string>) {
    var has_perm = false;
    perms.forEach((perm: string) => {
        try {
            if (user.has_perms[perm] === 'True') {
                has_perm = true;
            }
        } catch (error) {
            console.error(error)
        }
    })
    return has_perm;
}

export function is_team_manager(user, teams: Array<number>) {
    var is_manager = false;
    if (user.has_perms['team_manager']) {
        teams.forEach((team: number) => {
            if (team === parseInt(user.has_perms['team_manager'])) {
                is_manager = true;
            }
        })
    }
    return is_manager;
    
}

export function set_cookies(Astro, user_token) {
    Astro.cookies.delete('user_token');
    Astro.cookies.delete('token_expiry');
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
}