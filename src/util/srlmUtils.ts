import axios from "axios";

const api = {
    uri: import.meta.env.SRLM_API_URI,
    key: import.meta.env.SRLM_API_APP_KEY
};

export async function srlm_get(endpoint:string, user_token:string='') {
    const request_url = api['uri'] + endpoint;
    const api_token = api['key'] + user_token;

    return await axios.get(request_url, {
    headers: {
        Authorization: `Bearer ${api_token}`
    }
    }).then((response) => response.data).catch((err) => err);
};


export function convert_link(link: string) {
    return link.replace('/api', '')
}

export type Collection = {
    items: [];
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
    _links: {
        self: string;
        league: string;
        match_type: string;
        divisions: string;
    };
}