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

export default class TopGainers extends Component {

  constructor(){
    super();
    this.state = {
      count:'',
      top10:{labels:[],datasets:[]},
      data:{data:{openPrice:[], highPrice:[], lowPrice:[], ltp:[], previousPrice:[], netPrice:[], tradedQuantity:[], turnoverInLakhs:[], lastCorpAnnouncementDate:[],lastCorpAnnouncement:[]}},
      cardData:{openPrice:[], highPrice:[], lowPrice:[], ltp:[], previousPrice:[], netPrice:[], tradedQuantity:[], turnoverInLakhs:[], lastCorpAnnouncementDate:[],lastCorpAnnouncement:[]}
    }
  }

  fcolor(color){
    this.customColor=[];
    for(var j=0;j<this.count;j++){ 
         this.customColor[j]="green"
      }
  }

  storeData(temp){
    const op=[];
    const hp=[];
    const lp=[];
    const ltp=[];
    const pp=[];
    const np=[];
    const tq=[];
    const til=[];
    const lcad=[];
    const lca=[];
    for(var i=0; i<this.count; i++)
    {
      op[i]=temp.data[i].openPrice
      hp[i]=temp.data[i].highPrice
      lp[i]=temp.data[i].lowPrice
      ltp[i]=temp.data[i].ltp
      pp[i]=temp.data[i].previousPrice
      np[i]=temp.data[i].netPrice
      tq[i]=temp.data[i].tradedQuantity
      til[i]=temp.data[i].turnoverInLakhs
      lcad[i]=temp.data[i].lastCorpAnnouncementDate
      lca[i]=temp.data[i].lastCorpAnnouncement
    }
    this.setState({
      cardData: {
        openPrice: op,
        highPrice: hp,
        lowPrice: lp,
        ltp: ltp,
        previousPrice: pp,
        netPrice: np,
        tradedQuantity: tq,
        turnoverInLakhs: til,
        lastCorpAnnouncementDate: lcad,
        lastCorpAnnouncement: lca
      }})
  }
  
  componentWillMount(){
    this.fetchStocks();
  }

  fetchStocks() {
    Axios.get('https://www.nseindia.com/live_market/dynaContent/live_analysis/gainers/niftyGainers1.json').then(res => {
      this.count = Object.keys(res.data.data).length
      this.data = this.dumpComma(res.data);
      this.fcolor(this.data);
      this.storeData(this.data);
      const labels= [];
      const datasetOP=[];
      const datasetLTP=[];
      for(var i=0;i<this.count;i++)
      {
        labels[i]=this.data.data[i].symbol
        datasetOP[i]=this.data.data[i].openPrice
        datasetLTP[i]=this.data.data[i].ltp  
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
     for(var i=0;i<this.count;i++)
     {       
        com.data[i].openPrice = (com.data[i].openPrice + "").replace(',', '')
        com.data[i].previousPrice = (com.data[i].previousPrice + "").replace(',', '')
        com.data[i].ltp = (com.data[i].ltp + "").replace(',', '')
     }
     return com;
   }

   render(){
      var chart= this.state.top10
      var indents = [];
      for (var i = 0; i < this.count; i++) {
      indents.push(<Grid item lg={6} md={4} sm={6} xs={12}>
        <Accordion allowMultipleExpanded="true" allowZeroExpanded="true">
         <AccordionItem>
          <AccordionItemHeading>
              <AccordionItemButton><strong>{this.state.top10.labels[i]}</strong></AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Widget>
                <Typography variant="h6"><i>Open Price: {this.state.cardData.openPrice[i]}</i></Typography>
                <Typography variant="h6"><i>High Price: {this.state.cardData.highPrice[i]}</i></Typography>
                <Typography variant="h6"><i>Low Price: {this.state.cardData.lowPrice[i]}</i></Typography>
                <Typography variant="h6"><i>LTP: {this.state.cardData.ltp[i]}</i></Typography>
                <Typography variant="h6"><i>Previous Price: {this.state.cardData.previousPrice[i]}</i></Typography>
                <Typography variant="h6"><i>Net Price: {this.state.cardData.netPrice[i]}</i></Typography>
                <Typography variant="h6"><i>Traded Quantity: {this.state.cardData.tradedQuantity[i]}</i></Typography>
                <Typography variant="h6"><i>TurnOver in Lakhs: {this.state.cardData.turnoverInLakhs[i]}</i></Typography>
                <Typography variant="h6"><i>Last Corp Announcement Date: {this.state.cardData.lastCorpAnnouncementDate[i]}</i></Typography>
                <Typography variant="h6"><i>Last Corp Announcement: {this.state.cardData.lastCorpAnnouncement[i]}</i></Typography>
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
        <Widget
            title={<Typography variant="h3" component="h2" gutterBottom='true'>Top Gainers</Typography>}>
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