import { number, string } from "astro/zod";

export type Token = {
    token: string,
    expires: string
}

export type User = {
    id: number,
    username: string,
    email: string,
    player: number,
    discord: number,
    permissions: Array<string>,
    matches_streamed: number,
    reset_pass: boolean,
    _links: {
        self: string,
        player: string,
        discord: string,
        permissions: string,
        matches_streamed: string
    }
}

export type Permission = {
    id: number,
    key: string,
    description: string,
    users_count: number,
    _links: {
        self: string
    }
}

export type Discord = {
    user: string,
    discord_id: string,
    access_token: string,
    refresh_token: string,
    token_expiration: string,
    _links: {
        self: string,
        user: string
    }
}


export type League = {
    id: number,
    name: string,
    acronym: string,
    seasons_count: number,
    divisions_count: number,
    _links: {
        self: string,
        seasons: string,
        divisions: string
    };
}

type DivisionLink = {
    name: string,
    acronym: string,
    _link: string
}


export type Season = {
    id: number,
    name: string,
    acronym: string,
    league: string,
    start_date: string,
    end_date: string,
    finals_start: string,
    finals_end: string,
    match_type: string,
    can_register: boolean,
    divisions: Array<DivisionLink>,
    _links: {
        self: string;
        league: string;
        match_type: string;
        divisions: string;
    };
}

export type SeasonCollection = {
    items: Array<Season>,
    _links: {
        self: string,
        next: string,
        prev: string
    },
    _meta: {
        page: number,
        per_page: number,
        total_pages: number,
        total_items: number
    };
}

export type Division = {
    id: number,
    name: string,
    acronym: string,
    league: string,
    description: string,
    seasons_count: number,
    _links: {
        self: string,
        league: string,
        seasons: string
    }
}

export type SeasonDivision = {
    id: number,
    season: Season,
    division: Division,
    league: string,
    teams_count: number,
    free_agents_count: number,
    rookies_count: number,
    matches_count: number,
    finals_count: number,
    _links: {
        self: string,
        league: string,
        season: string,
        division: string,
        teams: string,
        free_agents: string,
        rookies: string,
        matches: string,
        finals: string,
    }
}


export type TeamStats = {
    id: number,
    name: string,
    acronym: string,
    color: string,
    logo: string,
    matches: number,
    wins: number,
    ot_wins: number,
    losses: number,
    ot_losses: number,
    points: number,
    goals_for: number,
    goals_against: number,
    players: Array<{
        id: number,
        name: string,
        start_date: string,
        end_date: string,
        periods: number,
        goals: number,
        shots: number,
        assists: number,
        saves: number
    }>,
    upcoming_matches: Array<Match>,
    completed_matches: Array<Match>
}


export type TeamPlayers = {
    team: string,
    acronym: string,
    color: string,
    players: Array<Player>
}


export type SeasonDivisionLeaderboard = {
    id: number,
    season: Season,
    division: Division,
    teams: Array<TeamStats>,
    free_agents: Array<{
        id: number,
        name: string,
        start_date: string,
        end_date: string,
        periods: number,
        goals: number,
        shots: number,
        assists: number,
        saves: number
    }>,
    most_goals: Array<{
        id: number,
        name: string,
        team_id: number,
        team: string,
        periods: number,
        goals: number,
        shots: number
    }>,
    most_assists: Array<{
        id: number,
        name: string,
        team_id: number,
        team: string,
        periods: number,
        assists: number,
        primary_assists: number
    }>,
    most_saves: Array<{
        id: number,
        name: string,
        team_id: number,
        team: string,
        periods: number,
        saves: number,
        blocks: number
    }>
}


export type Player = {
    id:number,
    player_name:string,
    user:string,
    slap_id:number,
    rookie:boolean,
    first_season:string,
    current_team:string,
    teams:number,
    free_agent_seasons:number,
    awards:number,
    stats: {
        periods: number,
        goals: number,
        shots: number,
        assists: number,
        saves: number
    }
}

export type PlayerTeams = {
    player: string,
    teams: Array<{
        name: string,
        acronym: string,
        color: string,
        dates: {
            start:string,
            end:string
        }
    }>,
    current_team: {
        id: number,
        name: string,
        acronym: string,
        color: string,
        owner: string,
        managers: Array<string>,
        dates: {
            start:string,
            end:string
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

export type Team = {
    id: number,
    name: string,
    acronym: string,
    color: string,
    dates: {
        start:string,
        end:string
    }
}

export type TeamCollection = {
    items: Array<{
        id: number,
        name: string,
        acronym: string,
        founded_date: string,
        color: string,
        logo: string,
        active_players: number,
        seasons_played: number,
        awards: number
    }>,
    _links: {
        self: string,
        next: string,
        prev: string
    },
    _meta: {
        page: number,
        per_page: number,
        total_pages: number,
        total_items: number
    }
}

export type PlayerCollection = {
    items: Array<Player>,
    _links: {
        self: string,
        next: string,
        prev: string
    },
    _meta: {
        page: number,
        per_page: number,
        total_pages: number,
        total_items: number
    }
}


export type MatchResults = {
    winner: string,
    loser: string,
    draw: boolean,
    score_winner: number,
    score_loser: number,
    overtime: boolean,
    forfeit: boolean,
    vod: string
}


export type Match = {
    id: number,
    season_division: SeasonDivision,
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
    results: MatchResults,
    has_review: boolean
}

export type Gamemode = {
    value: string,
    label: string,
    info: string
}

export type PlayerData = {
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

export type Period = {
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

export type SeasonApplication = {
    id: number,
    team: Team,
    player: Player,
    season: Season,
    division: Division,
    status: string,
    type: string
}

export type TeamInvite = {
    id: number,
    team: Team,
    invited_player: Player,
    inviting_player: Player,
    status: string
}

export type TeamManage = {
    id: number,
    name: string,
    acronym: string,
    color: string,
    logo: string,
    owner: string,
    founded: string,
    players: Array<{
        id: number,
        user_id: number,
        name: string,
        manager: boolean
    }>,
    upcoming_matches: Array<Match>,
    completed_matches: Array<Match>,
    applications: Array<SeasonApplication>,
    invites: Array<TeamInvite>,
    open_seasons: Array<Season>
}