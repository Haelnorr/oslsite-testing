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
    awayTeamID?: number,
    matchWeek?: number
}

type ColorStyles = {
    backgroundColor: string,
    color: string
}


function reactColorCalc(color:string):ColorStyles {
    var styleString = colorCalc(color)
        .replace('background-color: #', '"backgroundColor": "#')
        .replace('color: #', '"color": "#')
        .replace(';', '",')
    styleString = '{' + styleString + '"}';
    return JSON.parse(styleString);
}

function generateFixtures(teams:Array<SelectItem>): Array<MatchData> {
    var numTeams: number = teams.length;
    const matchData: Array<MatchData> = [];

    const dummyTeam = {
        id: 0,
        name: 'Dummy'
    }

    // Check if the number of teams is odd, if so, add a "dummy" team
    var dummy = false;
    if (numTeams % 2 !== 0) {
        teams.push(dummyTeam);
        dummy = true;
        numTeams += 1;
    }

    // Iterate through rounds
    var id = 0;
    for (let weekNum = 0; weekNum < numTeams - 1; weekNum++) {
        for (let i = 0; i < numTeams / 2; i++) {
            const homeTeam: number = teams[i].id;
            const awayTeam: number = teams[numTeams - 1 - i].id;
            if (homeTeam === 0 || awayTeam === 0 || homeTeam === awayTeam) {
                continue;
            }
            id += 1;
            var matchItem: MatchData = {
                id: id
            }
            if (weekNum%2 === 0) {
                matchItem.homeTeamID = homeTeam;
                matchItem.awayTeamID = awayTeam;
            } else {
                matchItem.homeTeamID = awayTeam;
                matchItem.awayTeamID = homeTeam;
            }
            matchItem.matchWeek = weekNum+1;
            matchData.push(matchItem);
        }

        // Rotate the teams for the next round
        teams.splice(1, 0, teams.pop() as SelectItem);
    }
    if (dummy) teams.splice(teams.indexOf(dummyTeam), 1);

    return matchData;
}


class DivisionSelect extends React.Component<{api:SRLMAPI, season:string, onChange:Function}, {DataIsLoaded:boolean, divisions:Array<SelectItem>, disabled:boolean, selected:string}> {
    constructor(props:{api:SRLMAPI, season:string, onChange:Function}) {
        super(props);
        this.state = {
            divisions: [],
            DataIsLoaded: false,
            disabled: false,
            selected: '',
        };
    }

    componentDidUpdate(nextProps:{api:SRLMAPI, season:string}) {
        if (this.props.season !== nextProps.season) {
            this.setData(this.props.season);
            this.setState({disabled:false, selected:''});
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
        if (selected !== '') {
            this.setState({disabled:true, selected:selected});
        } else {
            this.setState({disabled:false, selected:selected});
        }
    }

    render () {
        const { DataIsLoaded, divisions, disabled, selected } = this.state;
        if (!DataIsLoaded) {
            return 'Select a Season';
        } else {
            return (
                <>
                    <label className='font-bold'>Division: </label><br/>
                    <select disabled={disabled} value={selected} onChange={(e)=>this.handleChange(e.target.value)} required
                        className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600">
                        <option value="">Select Division</option>
                        {
                            divisions.map((divisions) => (
                                <option key={divisions.id} value={divisions.id}>{divisions.name}</option>
                            ))
                        }
                    </select>
                    {disabled &&
                        <><br/><a className='hover:underline hover:cursor-pointer' href="#" onClick={()=>this.handleChange('')}>clear</a></>
                    }
                </>
            );
        }
    }
}


class Match extends React.Component<
    {
        id:number, 
        teams:Array<SelectItem>, 
        onChange:Function, 
        matchData:MatchData,
        matchWeek:number
    }, 
    {
        homeColors:ColorStyles, 
        awayColors:ColorStyles, 
        homeTeam?:number, 
        awayTeam?:number, 
        homeIndex?:number,
        awayIndex?:number,
        matchWeek?:number
    }
> {
    constructor(props:{id:number, teams:Array<SelectItem>, onChange:Function, matchData:MatchData, matchWeek:number}) {
        super(props);
        var homeColor:string|undefined;
        var awayColor:string|undefined;
        var homeIndex:number|undefined;
        var awayIndex:number|undefined;
        this.props.teams.forEach((team, index) => {
            if (team.id === this.props.matchData.homeTeamID) {
                homeColor = team.color;
                homeIndex = index;
            } else if (team.id === this.props.matchData.awayTeamID) {
                awayColor = team.color;
                awayIndex = index;
            }
        });
        var homeColors = {
            backgroundColor: '#FFF',
            color: '#000'
        }
        var awayColors = {
            backgroundColor: '#FFF',
            color: '#000'
        }
        if (homeColor) {
            homeColors = reactColorCalc(homeColor);
        }
        if (awayColor) {
            awayColors = reactColorCalc(awayColor);
        }
        this.state = {
            homeTeam: this.props.matchData.homeTeamID,
            awayTeam: this.props.matchData.awayTeamID,
            homeColors: homeColors,
            awayColors: awayColors,
            homeIndex: homeIndex,
            awayIndex: awayIndex,
            matchWeek: this.props.matchWeek
        }
    }

    componentDidUpdate(nextProps:{matchWeek:number}) {
        if (nextProps.matchWeek !== this.props.matchWeek) {
            this.setState({matchWeek:this.props.matchWeek})
        }
    }

    updateParent(data:{homeTeam?:number, awayTeam?:number, matchWeek?:number}, teamIndex?: number) {
        var matchData:MatchData = {
            id:this.props.id
        };
        if (data.homeTeam) {
            matchData.homeTeamID = data.homeTeam;
            this.setState({
                homeColors:reactColorCalc(this.props.teams[teamIndex!].color!),
                homeTeam:data.homeTeam
            });
        };
        if (data.awayTeam) {
            matchData.awayTeamID = data.awayTeam;
            this.setState({
                awayColors:reactColorCalc(this.props.teams[teamIndex!].color!),
                awayTeam:data.awayTeam
            });
        };
        if (data.matchWeek) {
            matchData.matchWeek = data.matchWeek;
            this.setState({
                matchWeek:data.matchWeek
            })
        }
        this.props.onChange(matchData);
    }

    render() {
        const {teams, matchData} = this.props;
        const {homeColors, awayColors, homeTeam, awayTeam, homeIndex, awayIndex, matchWeek} = this.state;
        return (
            <div className='mt-2'>
                <select defaultValue={`${homeTeam},${homeIndex}`} style={homeColors} 
                    onChange={(e)=>this.updateParent({homeTeam:+e.target.value.split(',')[0]}, +e.target.value.split(',')[1])} required 
                    className="rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-[200px]">
                    {
                        teams.map((team, index) => {
                            if (team.id !== matchData.awayTeamID && team.id !== awayTeam) 
                                return (
                                    <option key={team.id} value={`${team.id},${index}`} style={reactColorCalc(team.color!)}>{team.name}</option>
                                )
                        })
                    }
                </select>
                <span className='px-4'>vs</span>
                <select defaultValue={`${matchData.awayTeamID},${awayIndex}`} style={awayColors} 
                    onChange={(e)=>this.updateParent({awayTeam:+e.target.value.split(',')[0]}, +e.target.value.split(',')[1])} required
                    className="rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-[200px]">
                    {
                        teams.map((team, index) => {
                            if (team.id !== matchData.homeTeamID && team.id !== homeTeam)
                                return (
                                    <option key={team.id} value={`${team.id},${index}`} style={reactColorCalc(team.color!)}>{team.name}</option>
                                )
                        })
                    }
                </select>
                <span className='pl-2'>
                    <label className='font-bold'>Match Week:</label>
                    <input type="number" min="1" value={matchWeek} onChange={(e)=>this.updateParent({matchWeek:+e.target.value})} required className="ml-2 text-black rounded-sm indent-2 shadow-black shadow-md outline outline-1 outline-gray-600 w-12" />
                </span>
            </div>
        )
    }
}


class Matches extends React.Component<{api:SRLMAPI, seasonDivision:string, onChange:Function}, {DataIsLoaded:boolean, teams:Array<SelectItem>, matchData:Array<MatchData>, gamesPerTeamPerWeek:number}> {
    constructor(props:{api:SRLMAPI, seasonDivision:string, onChange:Function}) {
        super(props);
        this.state = {
            DataIsLoaded: false,
            teams: [],
            matchData: [],
            gamesPerTeamPerWeek: 2
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
            const matchData = generateFixtures(resp.data.teams);
            this.setState({
                teams: resp.data.teams,
                DataIsLoaded: true,
                matchData: matchData
            });
            matchData.forEach((match:MatchData) => {
                this.props.onChange({matchData:match});
            })
        }).catch(err => {console.log(err)});
    }

    setRound(matchRound:string) {
        this.props.onChange({matchRound:+matchRound});
    }

    setGamesPerWeek(gamesPerWeek:number) {
        this.setState({gamesPerTeamPerWeek:gamesPerWeek});
    }

    updateMatchData(matchData:MatchData) {
        this.props.onChange({matchData:matchData});
    }

    render () {
        const { DataIsLoaded, teams, matchData, gamesPerTeamPerWeek } = this.state;
        const maxGamesPerWeek = teams.length + (teams.length%2) - 1;
        if (!DataIsLoaded) {
            return 'Select a Season';
        } else {
            return (
                <>
                    <table className='mx-auto'>
                        <tbody>
                            <tr>
                                <td className='p-1'>
                                    <label className='font-bold'>Round:</label>
                                </td>
                                <td className='p-1'>
                                    <input type="number" min="1" defaultValue="1" className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-12" onChange={(e)=>this.setRound(e.target.value)} required/>
                                </td>
                                <td className='p-1 pl-4'>
                                    <label className='font-bold'>Matches/team/week:</label>
                                </td>
                                <td className='p-1'>
                                    <input type="number" min="1" max={maxGamesPerWeek} defaultValue={gamesPerTeamPerWeek} className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-12" onChange={(e)=>this.setGamesPerWeek(+e.target.value)} required/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        {DataIsLoaded &&
                            <div>
                                {
                                    matchData.map((match:MatchData, index) => {
                                        const newMatchWeek = Math.ceil(match.matchWeek!/gamesPerTeamPerWeek);
                                        const numGames = matchData.length;
                                        const numRounds = teams.length + (teams.length%2) - 1;
                                        const gamesPerRound = numGames/numRounds;
                                        const endOfRound = (index+1) !== matchData.length && (index+1)%gamesPerRound === 0;
                                        return (
                                            <div key={match.id}>
                                                <Match id={match.id} teams={teams} matchData={match} matchWeek={newMatchWeek} onChange={(matchData:MatchData)=>this.updateMatchData(matchData)}/>
                                                {endOfRound &&
                                                    <>
                                                        {(index+1)%(gamesPerRound*gamesPerTeamPerWeek) === 0 &&
                                                            <hr className='mt-2 border-2 border-gray-400'/>
                                                            ||
                                                            <hr className='mt-2 border-gray-400'/>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        )
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




class CreateFixturesForm extends React.Component<
    {api:SRLMAPI}, 
    {
        DataIsLoaded:boolean, 
        seasons:Array<SelectItem>, 
        selectedSeason:string, 
        selectedDivision:string,
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
                    if (newMatchData.matchWeek) {
                        matchData[i].matchWeek = newMatchData.matchWeek;
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
        const { selectedDivision, matchRound, matchData } = state;
        //e.preventDefault();

        const formData = new FormData(e.target);
        formData.set('seasonDivisionID', selectedDivision);
        formData.set('round', matchRound!.toString());
        formData.append('matchData', JSON.stringify(matchData));

        axios.post('', formData).catch(err => console.log(err));
    }

    render () {
        const { DataIsLoaded, seasons, selectedSeason, selectedDivision } = this.state;
        if (!DataIsLoaded) {
            return 'loading...';
        } else {
            return (
                <div className='w-fit mx-auto'>
                    <form action="/manage/match" onSubmit={(e)=>this.handleSubmit(e, this.state)}>
                        <p className='w-fit mx-auto text-left min-w-[168px]'>
                            <label className='font-bold'>Season: </label><br/>
                            <select className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600" defaultValue="" onChange={(e)=>this.selectSeason(e.target.value)} required>
                                <option value="">Select Season</option>
                                {
                                    seasons.map((season) => (
                                        <option key={season.id} value={season.id}>{season.name}</option>
                                    ))
                                }
                            </select>
                        </p>
                        <p className='mt-2 w-fit mx-auto text-left min-w-[168px]'>
                            {selectedSeason &&
                                <DivisionSelect api={this.props.api} season={selectedSeason} onChange={(e:string)=>this.selectDivision(e)}/>
                            }
                        </p>
                        <div className='mt-2 w-fit mx-auto text-left min-w-[168px]'>
                            {selectedDivision &&
                                <Matches api={this.props.api} seasonDivision={selectedDivision} onChange={(e:any)=>this.handleMatchUpdate(e)} />
                            }
                        </div>
                        <button className="mt-4 bg-blue-400 bg-opacity-80 hover:shadow-md hover:bg-opacity-60 duration-200 transition-all text-white font-bold py-2 rounded-md shadow-black w-full">
                            Submit
                        </button>
                    </form>
                </div>
            );
        }
    }
}

export default CreateFixturesForm; 