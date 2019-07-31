import React from 'react'
import Axios from 'axios'
import ReactSearchBox from 'react-search-box'
import Grid from '@material-ui/core/Grid'
import Widget from "../../components/Widget"
import { TextField } from '@material-ui/core';
import { Typography } from '@material-ui/core/es';
import './vars'

export default class ExchangeR extends React.Component {

    constructor(){
        super()
        this.state = {
            names: [],
            count: '',
            bShow: false,
            cShow: false,
            amt: '',
            calc: '',
            helper: ''
        }
    }
    
    componentWillMount(){
        this.fetchNames()
    }

    fetchRates(){
        Axios.get('https://free.currconv.com/api/v7/convert?q='+global.base+'_'+global.con+'&compact=ultra&apiKey=c33e9a6737ef0b923395').then(res => {
            var amt = res.data[global.base+"_"+global.con]
            console.log(res.data)
            this.setState({
                helper: amt
            })
        })
    }

    fetchNames(){
        var names = []
        Axios.get('https://free.currconv.com/api/v7/currencies?apiKey=c33e9a6737ef0b923395').then(res => {
            var data = res.data.results
            const time = Object.keys(data)
            this.count = Object.keys(data).length
            for(var i = 0 ; i < this.count ; i++ )
            {
                names.push({"key": data[time[i]].id, "value": data[time[i]].id+" ( "+data[time[i]].currencyName+" )"})
            }
        })
        this.setState({
            loaded: true,
            names: names
        })
        console.log(this.state.names)
    }

    setBase(id){
        global.base=id.key
        this.setState( {bShow: true} )
        this.fetchRates()
    }

    setConversion(id){
        global.con=id.key
        this.setState( {cShow: true} )
        this.fetchRates()
    }

    handleChange(tmp){
        console.log(tmp)
        if(tmp === 0 && tmp === null && tmp === ''){
            tmp = 1
        }
            var cal = this.state.helper * tmp
            this.setState({
                amt: tmp,
                calc: cal
            })
    }

    render(){
        return(
            <React.Fragment>
                <Grid container spacing={32} alignItems="center" justify="center">
                    <Grid item xs={12} md={6} lg={4}>
                        <ReactSearchBox
                            placeholder="Select Base Currency"
                            data={this.state.names}
                            onSelect={record => this.setBase(record)}
                            onFocus={() => {
                                console.log('This function is called when is focused')
                            }}
                            onChange={value => console.log(value)}
                            fuseConfigs={{
                            threshold: 0.05,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <ReactSearchBox
                            placeholder="Select Conversion Currency"
                            data={this.state.names}
                            onSelect={record => this.setConversion(record)}
                            onFocus={() => {
                                console.log('This function is called when is focused')
                            }}
                            onChange={value => console.log(value)}
                            fuseConfigs={{
                            threshold: 0.05,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={32} alignItems="center" justify="center">
                    <Grid item xs={2}>
                        <Widget>
                            <TextField
                                id="outlined-full-width"
                                label="Enter amount"
                                onChange={val => this.handleChange(val.target.value)}
                            />
                        </Widget>
                    </Grid>
                </Grid> 
                <Grid container spacing={32} alignItems="center" justify="center">
                    <Grid item xs={4}>
                        <Widget>
                            <Typography variant="h4"><strong>Current Exchange Parameters: <i>{global.base}</i> to <i>{global.con}</i></strong></Typography>
                            <Typography variant="h3"><i>{this.state.amt} {global.base} = {this.state.calc} {global.con}</i></Typography>
                        </Widget>
                    </Grid>
                </Grid>        
            </React.Fragment>
        )
    }
}