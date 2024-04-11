import axios from "axios";
import type { StringLiteral } from "typescript";

const api = {
    uri: import.meta.env.SRLM_API_URI,
    key: import.meta.env.SRLM_API_APP_KEY
};

// handles response errors from the SRLM API
// will log the error message from SRLM API to the console along with the headers of the failed request
// returns null
function handle_err(err) {
    if (err) {
        if (err.response) {
            console.log(JSON.stringify(err.response.data));
        } else {
            // console.log(err.data)
        }
        console.log(err.request._header);
        return null;
    }
}

/** 
 * Makes a GET request to the SRLM api.
 * Uses axios and environment variables to make a GET request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth token - appends to SRLM_API_APP_KEY
 * 
 * @returns response.data
 */
export async function srlm_get(endpoint:string, user_token:string='') {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.get(request_url, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
};

// strip a link from the SRLM API of its /api prefix, allowing it to be used for url routing
export function convert_link(link: string) {
    return link.replace('/api', '')
}

/** 
 * Makes a POST request to the SRLM api.
 * Uses axios and environment variables to make a POST request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} endpoint       endpoint for the request - appends to env var SRLM_API_URI
 * @param {string} [user_token]   user auth token - appends to SRLM_API_APP_KEY
 * @param {dict}   [input]        body of the post request
 * 
 * @returns response.data
 */
export async function srlm_post(endpoint: string, user_token:string='', input:{}={}) {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.post(request_url, input, {
        headers: {
            Authorization: `Bearer ${api_token}`
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
}

/** 
 * Makes a Basic Auth POST request to the SRLM api.
 * Uses axios and environment variables to make a basic auth request to the SRLM api. If request fails, returns null and logs the API's error message and the request headers to console.
 * 
 * @param {string} username   username of the user
 * @param {string} password   password of the user
 * 
 * @returns response.data
 */
export async function srlm_basic_auth(username: string, password: string) {
    const request_url = api['uri'] + '/auth/user';
    
    return await axios.post(request_url, {}, {
        auth: {
            username: username,
            password: password
        }
    }).then((response) => response.data).catch((err) => handle_err(err));
}

export type Token = {
    token: string;
    expires: Date;
}

export type User = {
    id: number;
    username: string;
    email: string;
    player: number;
    discord: number;
    permissions: Array<string>;
    matches_streamed: number;
    reset_pass: boolean;
    _links: {
        self: string;
        player: string;
        discord: string;
        permissions: string;
        matches_streamed: string;
    }
}

export type Permission = {
    id: number;
    key: string;
    description: string;
    users_count: number;
    _links: {
        self: string;
    }
}

export type Discord = {
    user: string;
    discord_id: string;
    access_token: string;
    refresh_token: string;
    token_expiration: Date;
    _links: {
        self: string;
        user: string;
    }
}


export type League = {
    id: number;
    name: string;
    acronym: string;
    seasons_count: number;
    divisions_count: number;
    _links: {
        self: string;
        seasons: string;
        divisions: string;
    };
}

type DivisionLink = {
    name: string;
    _link: string;
}


export type Season = {
    id: number;
    name: string;
    acronym: string;
    league: string;
    start_date: Date;
    end_date: Date;
    finals_start: Date;
    finals_end: Date;
    match_type: string;
    divisions: Array<DivisionLink>
    _links: {
        self: string;
        league: string;
        match_type: string;
        divisions: string;
    };
}

export type SeasonCollection = {
    items: Array<Season>;
    _links: {
        self: string;
        next: string;
        prev: string
    };
    _meta: {
        page: number;
        per_page: number;
        total_pages: number;
        total_items: number;
    };
}

export type Division = {
    id: number;
    name: string;
    acronym: string;
    league: string;
    description: string;
    seasons_count: number;
    _links: {
        self: string;
        league: string;
        seasons: string;
    }
}

export type SeasonDivision = {
    id: number;
    season: Season;
    division: Division;
    league: string;
    teams_count: number;
    free_agents_count: number;
    rookies_count: number;
    matches_count: number;
    finals_count: number;
    _links: {
        self: string;
        league: string;
        season: string;
        division: string;
        teams: string;
        free_agents: string;
        rookies: string;
        matches: string;
        finals: string;
    }
}

export type SimpleTeam = {
    name: string;
    acronym: string;
    color: string;
    _links: {
        self: string;
    }
}