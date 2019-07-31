import React , {Component} from "react"
import Axios from 'axios'
import SearchBar from './SearchBar';

export default class Search extends Component{

    constructor(){
        super()
        this.state ={
            names: [],
            count:'',
            loaded: false
        }
    }

    async componentWillMount(){
        await Axios.get('http://www.nseindia.com/content/equities/EQUITY_L.csv').then(res => {
            var data = res.data.split("\n").map(function(row){return row.split(",");})
            console.log(data)
            this.count = Object.keys(data).length
            const name = [];
            for(var i=1;i<this.count;i++){
                name.push({"key": data[i][0], "value": data[i][1]})
            }
            this.setState({
                names: name
            })
        })
        this.setState({
            loaded: true
        })
    }

    okShoot(){
        return(
            <SearchBar items={this.state.names} />
        )
    }

    render(){
    return(
        <div>
            {this.state.loaded ? this.okShoot() : null}
        </div>
    )
    }
}