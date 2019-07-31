import React , {Component} from "react"

import { HorizontalBar } from 'react-chartjs-2'

import Grid from '@material-ui/core/Grid'
import Widget from "../../components/Widget"

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from 'react-accessible-accordion';

import 'react-accessible-accordion/dist/fancy-example.css';

import Axios from 'axios'
import { Typography } from "@material-ui/core";

export default class Dashboard extends Component {

  constructor(){
    super();
    this.state = {
      count:'',
      top10:{labels:[],datasets:[]},
      data:{data:{openPrice:[], highPrice:[], lowPrice:[], ltp:[], previousPrice:[], netPrice:[], tradedQuantity:[], turnoverInLakhs:[], lastCorpAnnouncementDate:[],lastCorpAnnouncement:[]}},
      cardData:{open:[], high:[], low:[], last:[], previousClose:[], percChange:[], yearHigh:[], yearLow:[], indexOrder:[]}
    }
  }

  fcolor(color){
    this.customColor=[];
    for(var j=0;j<10;j++){ 
       if(color.data[j].last>color.data[j].previousClose){
         this.customColor[j]="green"
        }
        else if(color.data[j].last<color.data[j].previousClose){
          this.customColor[j]="red"
        }
        else{
          this.customColor[j]="blue"
        }
      }
  }

  storeData(temp){
    const op=[];
    const hp=[];
    const lp=[];
    const ltp=[];
    const pc=[];
    const pcc=[];
    const yh=[];
    const yl=[];
    const io=[];
    for(var i=0; i<10; i++)
    {
      op[i]=temp.data[i].open
      hp[i]=temp.data[i].high
      lp[i]=temp.data[i].low
      ltp[i]=temp.data[i].last
      pc[i]=temp.data[i].previousClose
      pcc[i]=temp.data[i].percChange
      yh[i]=temp.data[i].yearHigh
      yl[i]=temp.data[i].yearLow
      io[i]=temp.data[i].indexOrder
    }
    this.setState({
      cardData: {
        open: op,
        high: hp,
        low: lp,
        last: ltp,
        previousClose: pc,
        percChange: pcc,
        yearHigh: yh,
        yearLow: yl,
        indexOrder: io
      }})
  }
  
  componentWillMount(){
    this.fetchStocks();
  }

  fetchStocks() {
    Axios.get('https://nseindia.com/live_market/dynaContent/live_watch/stock_watch/liveIndexWatchData.json').then(res => { 
      this.data = this.dumpComma(res.data);
      this.fcolor(this.data);
      this.storeData(this.data);
      const labels= [];
      const datasetOP=[];
      const datasetLTP=[];
      for(var i=0;i<10;i++){
        labels[i]=this.data.data[i].indexName
        datasetOP[i]=this.data.data[i].open
        datasetLTP[i]=this.data.data[i].last 
      }
      this.setState({
        top10:{
          labels: labels,
          datasets:[
            {
              label:'Open Price',
              backgroundColor:this.customColor,
              data: datasetOP
            },
            {
              label:'Close Price',
              backgroundColor:"black",
              data: datasetLTP
            }
          ]
        }        
      })
    }
      )
  }

   dumpComma(com){
     for(var i=0;i<10;i++) {       
        com.data[i].open = (com.data[i].open + "").replace(',', '')
        com.data[i].last = (com.data[i].last + "").replace(',', '')
        com.data[i].previousClose = (com.data[i].previousClose + "").replace(',', '')
     }
     return com;
   }

   render(){
      var chart= this.state.top10
      var indents = [];
      for (var i = 0; i < 10; i++) {
      indents.push(<Grid item lg={6} md={4} sm={6} xs={12}>
        <Accordion allowMultipleExpanded="true" allowZeroExpanded="true">
         <AccordionItem>
          <AccordionItemHeading>
              <AccordionItemButton><strong>{this.state.top10.labels[i]}</strong></AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Widget>
                <Typography variant="h6"><i>Open Price: {this.state.cardData.open[i]}</i></Typography>
                <Typography variant="h6"><i>High Price: {this.state.cardData.high[i]}</i></Typography>
                <Typography variant="h6"><i>Low Price: {this.state.cardData.low[i]}</i></Typography>
                <Typography variant="h6"><i>Last Price: {this.state.cardData.last[i]}</i></Typography>
                <Typography variant="h6"><i>Previous Close: {this.state.cardData.previousClose[i]}</i></Typography>
                <Typography variant="h6"><i>% Change: {this.state.cardData.percChange[i]}</i></Typography>
                <Typography variant="h6"><i>Year High: {this.state.cardData.yearHigh[i]}</i></Typography>
                <Typography variant="h6"><i>Year Low: {this.state.cardData.yearLow[i]}</i></Typography>
                <Typography variant="h6"><i>Index Order: {this.state.cardData.indexOrder[i]}</i></Typography>
            </Widget>
            </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </Grid>);
      }
    return(
      <React.Fragment>
        <div>
        <Grid container spacing={32}   justify="center" alignItems="flex-start">
        <Grid item md={10}>
        <Widget title={<Typography variant="h3" component="h2" gutterBottom='true'>Market Watch</Typography>} >
        <HorizontalBar
            data={this.state.top10}
            options={{
              scales:{
                yAxes: [{
                  stacked: true,
              }]
              },
                legend:{
                display: false,
                position: 'top'
                },
                onClick: function (evt,array){
                  if(array[0]){
                  console.log(array[0]._index)
                  alert("You can find the card for "+chart.labels[array[0]._index]+" below in the card deck")
                  }
                }
            }}/>
            </Widget>
            </Grid>
            </Grid>
            <Grid container spacing={32}>
              {indents}
            </Grid>
        </div>
    </React.Fragment>
    )
  }
}