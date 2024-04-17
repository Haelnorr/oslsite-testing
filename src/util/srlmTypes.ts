import type { number } from "astro/zod";

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
    acronym: string;
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
    current_team: {
        name: string,
        acronym: string,
        color: string,
        dates: {
            start:Date,
            end:Date
        }
    }
}

export type Twitch = {
    user: string,
    twitch_id: string,
    access_token: string,
    refresh_token: string,
    token_expiration: string,
}

type Team = {
    id: number,
    name: string,
    acronym: string,
    color: string
}


export type Match = {
    id: number,
    season_division: string,
    home_team: Team,
    away_team: Team,
    round: number,
    match_week: number,
    cancelled: string,
    streamer: {
        user: string,
        twitch_id: string
    }
    final: boolean,
    scheduled_time: string,
    current_lobby: {
        id: number,
        password: string
    }
    results: {
        winner: string,
        loser: string,
        draw: boolean,
        score_winner: number,
        score_loser: number,
        overtime: boolean,
        forfeit: boolean,
        vod: string
    }
}

export type Gamemode = {
    value: string,
    label: string,
    info: string
}

type PlayerData = {
    id: number,
    player: string,
    team: string,
    goals: number,
    shots: number,
    assists: number,
    saves: number,
    primary_assists: number,
    secondary_assists: number,
    passes: number,
    blocks: number,
    takeaways: number,
    turnovers: number,
    possession_time_sec: number,
    game_winning_goals: number,
    post_hits: number,
    faceoffs_won: number,
    faceoffs_lost: number,
    score: number,
    periods_played: number
}

type Period = {
    id: number,
    lobby_id: number,
    processed: boolean,
    accepted: boolean,
    match_id: string,
    region: string,
    gamemode: string,
    created: string,
    arena: string,
    home_score: number,
    away_score: number,
    winner: string,
    current_period: number,
    periods_enabled: boolean,
    custom_mercy_rule: string,
    end_reason: string,
    source: string,
    player_data: {
        home: Array<PlayerData>,
        away: Array<PlayerData>
    }
}

export type MatchStats = {
    match_id: number,
    match_details: {
        id: number,
        home_team: Team,
        away_team: Team,
        result: string,
        round: number,
        match_week: number,
        final: boolean,
        scheduled_time: string
    },
    periods: {
        period1: Period,
        period2: Period,
        period3: Period
    },
    stat_totals: {
        home: Array<PlayerData>,
        away: Array<PlayerData>
    }
}