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


export type Player = {
    id:number,
    user:string,
    slap_id:number,
    rookie:boolean,
    first_season:string,
    current_team:string,
    teams:number,
    free_agent_seasons:number,
    awards:number,
}

export type PlayerTeams = {
    player: string,
    teams: Array<{
        name: string,
        acronym: string,
        color: string,
        dates: {
            start:Date,
            end:Date
        }
    }>,
}

export type Twitch = {
    user: string,
    twitch_id: string,
    access_token: string,
    refresh_token: string,
    token_expiration: string,
}