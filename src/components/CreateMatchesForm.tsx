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
                <>
                    <label className='font-bold'>Division: </label><br/>
                    <select className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600" defaultValue="" onChange={(e)=>this.handleChange(e.target.value)} required>
                        <option value="">Select Division</option>
                        {
                            divisions.map((divisions) => (
                                <option key={divisions.id} value={divisions.id}>{divisions.name}</option>
                            ))
                        }
                    </select>
                </>
            );
        }
    }
}


class Match extends React.Component<{id:number, teams:Array<SelectItem>, onChange:Function}, {homeColors:ColorStyles, awayColors:ColorStyles, homeTeam?:number, awayTeam?:number}> {
    constructor(props:{id:number, teams:Array<SelectItem>, onChange:Function}) {
        super(props);
        this.state = {
            homeColors: {
                backgroundColor: '#FFF',
                color: '#000'
            },
            awayColors: {
                backgroundColor: '#FFF',
                color: '#000'
            }
        }
    }

    updateParent(data:{homeTeam?:number, awayTeam?:number}, teamIndex: number) {
        var matchData:MatchData = {
            id:this.props.id
        };
        if (data.homeTeam) {
            matchData.homeTeamID = data.homeTeam;
            this.setState({
                homeColors:reactColorCalc(this.props.teams[teamIndex].color!),
                homeTeam:data.homeTeam
            });
        };
        if (data.awayTeam) {
            matchData.awayTeamID = data.awayTeam;
            this.setState({
                awayColors:reactColorCalc(this.props.teams[teamIndex].color!),
                awayTeam:data.awayTeam
            });
        };
        this.props.onChange(matchData);
    }

    render() {
        const {teams} = this.props;
        const {homeColors, awayColors, homeTeam, awayTeam} = this.state;
        return (
            <div className='mt-1'>
                <select className="rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600" defaultValue="" style={homeColors} onChange={(e)=>this.updateParent({homeTeam:+e.target.value.split(',')[0]}, +e.target.value.split(',')[1])} required>
                    <option value="" style={{backgroundColor:'#FFF', color: '#000'}}>Select Home Team</option>
                    {
                        teams.map((team, index) => {
                            if (team.id !== awayTeam)
                                return (
                                    <option key={team.id} value={`${team.id},${index}`} style={reactColorCalc(team.color!)}>{team.name}</option>
                                )
                        })
                    }
                </select>
                <span className='px-4'>vs</span>
                <select className="rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600" defaultValue="" style={awayColors} onChange={(e)=>this.updateParent({awayTeam:+e.target.value.split(',')[0]}, +e.target.value.split(',')[1])} required>
                    <option value="" style={{backgroundColor:'#FFF', color: '#000'}}>Select Away Team</option>
                    {
                        teams.map((team, index) => {
                            if (team.id !== homeTeam)
                                return (
                                    <option key={team.id} value={`${team.id},${index}`} style={reactColorCalc(team.color!)}>{team.name}</option>
                                )
                        })
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
                    <table className='mx-auto'>
                        <tbody>
                            <tr>
                                <td className='p-1'>
                                    <label className='font-bold'>Match Week:</label>
                                </td>
                                <td className='p-1'>
                                    <input type="number" min="0" className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-12" onChange={(e)=>this.setMatchWeek(e.target.value)} required/>
                                </td>
                            </tr>
                            <tr>
                                <td className='p-1'>
                                    <label className='font-bold'>Round:</label>
                                </td>
                                <td className='p-1'>
                                    <input type="number" min="0" className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-12" onChange={(e)=>this.setRound(e.target.value)} required/>
                                </td>
                            </tr>
                            <tr>
                                <td className='p-1'>
                                    <label className='font-bold'>Match Count:</label>
                                </td>
                                <td className='p-1'>
                                    <input type="number" min="0" className="text-black rounded-sm shadow-black shadow-md outline outline-1 outline-gray-600 w-12" onChange={(e)=>this.setMatchCount(e.target.value)} required/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
        //e.preventDefault();

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
                                <Matches api={this.props.api} seasonDivision={selectedDivision} onChange={(e:any)=>this.handleMatchUpdate(e)}/>
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

export default CreateMatchesForm;