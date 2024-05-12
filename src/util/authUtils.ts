import type { AstroGlobal } from "astro";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import { SRLMAPIError, srlmPost } from "./srlmUtils";
import type { Token, UserValidate } from "./srlmTypes";

/**
 * Returns a UserVerify object with user details and permissions
 * @param  token user token from cookies
 * @param perms array of perm identifiers
 */
export async function validateUser(token: string|undefined, perms?:Array<string>): Promise<UserValidate|undefined> {
    var input = {};
    if (perms) {
        input = {perms:perms}  
    }

    try {
        const permsResp: UserValidate = await srlmPost('/auth/user/validate', token, input);
        var permsList:{[key:string]:string} = {};
        permsResp.has_perms.map((perm: Array<string>) => {
            permsList[perm[0]] = perm[1];
        })
        permsResp.perms = permsList;
        return permsResp;

    } catch (error) {
        if (error instanceof SRLMAPIError) {
            throw error;
        } else {
            console.error(error);
            return;
        }
    }
}

export function permsHasOneOf(user: void|UserValidate, perms: Array<string>): boolean {
    if (!user) {
        return false
    }
    var hasPerm = false;
    perms.forEach((perm: string) => {
        try {
            if (user.perms[perm] !== 'False') {
                hasPerm = true;
            }
        } catch (error) {
            console.error(error)
        }
    })
    return hasPerm;
}

export function isTeamManager(user: UserValidate|void, teams: Array<number|undefined>): boolean {
    var isManager = false;
    if(!user) {
        return false;
    }
    if (user.perms['team_manager']) {
        teams.forEach((team) => {
            if (team) {
                if (team === parseInt(user.perms['team_manager'])) {
                    isManager = true;
                }
            }
        })
    }
    return isManager;
    
}

export function isTeamOwner(user: UserValidate|void, team_id: number|undefined): boolean {
    var isOwner = false;
    if(!user || !team_id) {
        return false;
    }
    if (user.perms['team_owner']) {
        const teams = user.perms['team_owner'].split(',');

        teams.forEach((team: string) => {
            if (parseInt(team) === team_id) {
                isOwner = true;
            }
        })
    }
    return isOwner;
}

export function setCookies(Astro: Readonly<AstroGlobal<Record<string, any>, AstroComponentFactory, Record<string, any>>>, userToken: Token): void {
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