import React from 'react';
import Widget from "../../components/Widget"
import { Line } from 'react-chartjs-2'
import Grid from '@material-ui/core/Grid'
import { Typography } from "@material-ui/core";
import Axios from 'axios'
import './vars'

export default class Display extends React.Component{

    constructor(){
        super()
        this.state={
            stocks: [],
            chartD: [],
            loaded: false,
            prev: []
        }
    }

    componentWillMount(){
        this.fetchStocks()
    }

    storeData(tmp, time){
        var stocksData = []
        for(var i=0;i<10;i++){
            stocksData.push({
                "open": tmp["Time Series (5min)"][time[i]]["1. open"],
                "high": tmp["Time Series (5min)"][time[i]]["2. high"],
                "low": tmp["Time Series (5min)"][time[i]]["3. low"],
                "close": tmp["Time Series (5min)"][time[i]]["4. close"]
            })
        }
        this.setState({
            stocks: stocksData
        })
        this.setState({
            loaded: true
        })
    }

    fetchStocks(){  
        Axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=NSE:'+global.stockKey+'&interval=5min&apikey=50PKJWDFRFMOWAOQ').then(res => {
            console.log(res.data)
            const time = Object.keys(res.data["Time Series (5min)"])
            this.storeData(res.data, time)
            var datasetOP = []
            var timeLabel = []
            for(var i=0,j=9;i<10 || j>0;i++,j--){
                datasetOP[j] = this.state.stocks[i].open
                timeLabel[j] = time[i]
            }
            this.setState({
                chartD: {
                    labels: timeLabel,
                    datasets:[
                        {
                            label: "Open Price",
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,0.4)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: datasetOP
                        }
                    ]
                },
                prev: global.stockKey
            })
     })
    }

    okShoot(){
        console.log(this.state.stocks[0].open)
        return(
            <Grid container justify="center" alignItems="center">
                <Grid item lg={8}>
                    <Widget title={<Typography variant="h3" component="h2" gutterBottom='true'>{global.stockName}</Typography>}>
                        <Line
                            data={this.state.chartD}
                            options={{
                                legend:{
                                display: false,
                                position: 'top'
                                }
                            }}/>
                    </Widget>
                </Grid>
                <Grid item lg={8}>
                    <Widget>
                        <Typography variant="h3" component="h2" gutterBottom='true'><strong>Symbol: {global.stockKey}</strong></Typography>
                        <Typography variant="h5"><i>Open Price: {this.state.stocks[0].open}</i></Typography>
                        <Typography variant="h5"><i>High Price: {this.state.stocks[0].high}</i></Typography>
                        <Typography variant="h5"><i>Low Price: {this.state.stocks[0].low}</i></Typography>
                        <Typography variant="h5"><i>Close Price: {this.state.stocks[0].close}</i></Typography>
                    </Widget>
                </Grid>
            </Grid>            
          )
    }
      render(){
          if(this.state.prev !== global.stockKey && global.flag===1){
              this.componentWillMount()
              global.flag = 0
          }       
          return(
            <div>
                {this.state.loaded ? this.okShoot() : null}
            </div>
          )
      }
  }