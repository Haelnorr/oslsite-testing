import React from 'react';
import axios from 'axios';
import { colorCalc, type SRLMAPI } from '../util/srlmUtils';

type SelectItem = {
    id: number,
    name: string,
    color?: string
}


type MatchData = {
    id:number,
    homeTeamID?: number,
    awayTeamID?: number
}


function reactColorCalc(color:string) {
    var styleString = colorCalc(color)
        .replace('background-color: #', '"backgroundColor": "#')
        .replace('color: #', '"color": "#')
        .replace(';', '",')
    styleString = '{' + styleString + '"}';
    return JSON.parse(styleString);
}



class DivisionSelect extends React.Component<{api:SRLMAPI, season:string, onChange:Function}, {DataIsLoaded:boolean, divisions:Array<SelectItem>}> {
    constructor(props:{api:SRLMAPI, season:string, onChange:Function}) {
        super(props);
        this.state = {
            divisions: [],
            DataIsLoaded: false,
        };
    }

    componentDidUpdate(nextProps:{api:SRLMAPI, season:string}) {
        if (this.props.season !== nextProps.season) {
            this.setData(this.props.season);
        }
    }

    setData(season:string) {
        axios.get(`${this.props.api.uri}/seasons/${season}/divisions-list`).then((resp:any) =>{
            this.setState({
                divisions: resp.data.divisions,
                DataIsLoaded: true
            });
        }).catch(err => {console.log(err)});
    }

    componentDidMount() {
        this.setData(this.props.season);
    }

    handleChange(selected:string) {
        this.props.onChange(selected);
    }

    render () {
        const { DataIsLoaded, divisions } = this.state;
        if (!DataIsLoaded) {
            return 'Select a Season';
        } else {
            return (
                <select className="text-black" defaultValue="" onChange={(e)=>this.handleChange(e.target.value)} required>
                    <option value="">Select Division</option>
                    {
                        divisions.map((divisions) => (
                            <option key={divisions.id} value={divisions.id}>{divisions.name}</option>
                        ))
                    }
                </select>
            );
        }
    }
}


class Match extends React.Component<{id:number, teams:Array<SelectItem>, onChange:Function}> {
    constructor(props:{id:number, teams:Array<SelectItem>, onChange:Function}) {
        super(props);
    }

    updateParent(data:{homeTeam?:number, awayTeam?:number}) {
        var matchData:MatchData = {
            id:this.props.id
        };
        if (data.homeTeam) {
            matchData.homeTeamID = data.homeTeam;
        };
        if (data.awayTeam) {
            matchData.awayTeamID = data.awayTeam;
        };
        this.props.onChange(matchData);
    }

    render() {
        const {teams, id} = this.props;
        return (
            <div className="mt-2">
                <select className="text-black" defaultValue="" onChange={(e)=>this.updateParent({homeTeam:+e.target.value})} required>
                    <option value="">Select Home Team</option>
                    {
                        teams.map((team) => (
                            <option key={team.id} value={team.id} style={reactColorCalc(team.color!)}>{team.name}</option>
                            
                        ))
                    }
                </select>
                <select className="text-black" defaultValue="" onChange={(e)=>this.updateParent({awayTeam:+e.target.value})} required>
                    <option value="">Select Away Team</option>
                    {
                        teams.map((team) => (
                            <option key={team.id} value={team.id} style={reactColorCalc(team.color!)}>{team.name}</option>
                        ))
                    }
                </select>
            </div>
        )
    }
}


class Matches extends React.Component<{api:SRLMAPI, seasonDivision:string, onChange:Function}, {DataIsLoaded:boolean, teams:Array<SelectItem>, matchCount:number}> {
    constructor(props:{api:SRLMAPI, seasonDivision:string, onChange:Function}) {
        super(props);
        this.state = {
            DataIsLoaded: false,
            teams: [],
            matchCount: 0
        };
    }

    componentDidUpdate(nextProps:{api:SRLMAPI, seasonDivision:string}) {
        if (this.props.seasonDivision !== nextProps.seasonDivision) {
            this.setData(this.props.seasonDivision);
        }
    }

    componentDidMount() {
        this.setData(this.props.seasonDivision);
    }

    setData(seasonDivision:string) {
        axios.get(`${this.props.api.uri}/season_division/${seasonDivision}/teams-list`).then((resp:any) =>{
            this.setState({
                teams: resp.data.teams,
                DataIsLoaded: true,
            });
        }).catch(err => {console.log(err)});
    }

    setMatchWeek(matchWeek:string) {
        this.props.onChange({matchWeek:+matchWeek});
    }

    setRound(matchRound:string) {
        this.props.onChange({matchRound:+matchRound});
    }

    setMatchCount(matchCount:string) {
        this.setState({matchCount:+matchCount})
    }

    updateMatchData(matchData:MatchData) {
        this.props.onChange({matchData:matchData})
    }

    getMatchIterator() {
        const { matchCount } = this.state;
        var iterator = [];
        for (var i=1;i<=matchCount;i++) {
            iterator.push(i);
        }
        return iterator;
    }

    render () {
        const { DataIsLoaded, matchCount, teams } = this.state;
        const matchIterator = this.getMatchIterator();
        if (!DataIsLoaded) {
            return 'Select a Season';
        } else {
            return (
                <>
                    <p>
                        <label>Match Week</label>
                        <input type="number" min="0" className="text-black" onChange={(e)=>this.setMatchWeek(e.target.value)} required/>
                    </p>
                    <p>
                        <label>Round</label>
                        <input type="number" min="0" className="text-black" onChange={(e)=>this.setRound(e.target.value)} required/>
                    </p>
                    <p>
                        <label>Match Count:</label>
                        <input type="number" min="0" className="text-black" onChange={(e)=>this.setMatchCount(e.target.value)} required/>
                    </p>
                    <div>
                        {(DataIsLoaded && matchCount > 0) &&
                            <div>
                                {
                                    matchIterator.map((item:number) => {
                                        return <Match key={item} id={item} teams={teams} onChange={(matchData:MatchData)=>this.updateMatchData(matchData)}/>
                                    })
                                }
                            </div>
                        }
                    </div>
                </>
            );
        }
    }
}




class CreateMatchesForm extends React.Component<
    {api:SRLMAPI}, 
    {
        DataIsLoaded:boolean, 
        seasons:Array<SelectItem>, 
        selectedSeason:string, 
        selectedDivision:string,
        matchWeek:number|undefined,
        matchRound:number|undefined,
        matchData:Array<MatchData>
    }> 
{
    constructor(props:{api:SRLMAPI}) {
        super(props);
        this.state = {
            seasons: [],
            DataIsLoaded: false,
            selectedSeason: '',
            selectedDivision: '',
            matchWeek:undefined,
            matchRound:undefined,
            matchData: []
        };
    }

    componentDidMount() {
        axios.get(`${this.props.api.uri}/seasons/list`).then((resp:any) =>{
            this.setState({
                seasons: resp.data.seasons,
                DataIsLoaded: true,
            });
        }).catch(err => {console.log(err)});
    }

    selectSeason(selected:string) {
        this.setState({selectedSeason:selected, selectedDivision:''});
    }

    selectDivision(e:string) {
        this.setState({selectedDivision:e});
    }

    handleMatchUpdate(e:{matchWeek?:number, matchRound?:number, matchData?:MatchData}) {
        if (e.matchWeek) {
            this.setState({matchWeek:e.matchWeek});
        }
        if (e.matchRound) {
            this.setState({matchRound:e.matchRound});
        }
        if (e.matchData) {
            const newMatchData = e.matchData;
            var matchData = this.state.matchData;
            var exists = false;
            for (var i=0;i<matchData.length;i++) {
                if (matchData[i].id === newMatchData.id) {
                    exists = true;
                    if (newMatchData.homeTeamID) {
                        matchData[i].homeTeamID = newMatchData.homeTeamID;
                    };
                    if (newMatchData.awayTeamID) {
                        matchData[i].awayTeamID = newMatchData.awayTeamID;
                    };
                    break;
                }
            }
            if (!exists) {
                matchData.push(newMatchData);
            }
            this.setState({matchData:matchData});
        }
    }

    handleSubmit(e:any, state:any) {
        const { selectedDivision, matchRound, matchWeek, matchData } = state;
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.set('seasonDivisionID', selectedDivision);
        formData.set('round', matchRound!.toString());
        formData.set('matchWeek', matchWeek!.toString());
        formData.append('matchData', JSON.stringify(matchData));

        axios.post('', formData).catch(err => console.log(err));
    }

    render () {
        const { DataIsLoaded, seasons, selectedSeason, selectedDivision } = this.state;
        if (!DataIsLoaded) {
            return 'loading...';
        } else {
            return (
                <div>
                    <form action="/manage/match" onSubmit={(e)=>this.handleSubmit(e, this.state)}>
                        <select className="text-black" defaultValue="" onChange={(e)=>this.selectSeason(e.target.value)} required>
                            <option value="">Select Season</option>
                            {
                                seasons.map((season) => (
                                    <option key={season.id} value={season.id}>{season.name}</option>
                                ))
                            }
                        </select>
                        {selectedSeason &&
                            <DivisionSelect api={this.props.api} season={this.state.selectedSeason} onChange={(e:string)=>this.selectDivision(e)}/>
                        }
                        {selectedDivision &&
                            <Matches api={this.props.api} seasonDivision={selectedDivision} onChange={(e:any)=>this.handleMatchUpdate(e)}/>
                        }
                        <button>Submit</button>
                    </form>
                </div>
            );
        }
    }
}

export default CreateMatchesForm;