import { srlmPost } from "./srlmUtils";

export async function validateUser(token: string, perms:Array<string>=null) {
    if (perms) {
        var perms_resp = await srlmPost('/auth/user/validate', token, {perms:perms});
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
        return await srlmPost('/auth/user/validate', token);
    }
}

export function permsHasOneOf(user, perms: Array<string>) {
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

export function isTeamManager(user, teams: Array<number>) {
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

export function is_team_owner(user, team_id: number) {
    var is_owner = false;
    if (user.has_perms['team_owner']) {
        const teams = user.has_perms['team_owner'].split(',');

        teams.forEach((team: string) => {
            if (parseInt(team) === team_id) {
                is_owner = true;
            }
        })
    }
    return is_owner;
    
}

export function set_cookies(Astro, userToken) {
    Astro.cookies.delete('user_token');
    Astro.cookies.delete('token_expiry');
    Astro.cookies.set('user_token', userToken.token, { 
        maxAge: 60480000,
        httpOnly: true,
        path: '/'
    })
    Astro.cookies.set('token_expiry', userToken.expires, { 
        maxAge: 604800,
        httpOnly: true,
        path: '/'
    })
}