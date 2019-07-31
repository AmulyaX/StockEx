import React from 'react';
import ReactSearchBox from 'react-search-box'
import Grid from '@material-ui/core/Grid'
import './vars'
import Display from './Display'

export default class SearchBar extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            data: props.items,
            show: false,
        }
        this.fetchData = this.fetchData.bind(this)
        console.log(props.items)
    }

    fetchData = (key) => {
        global.stockKey = key.key
        global.stockName = key.value
        this.setState( {show: true} )
        global.flag = 1
        console.log(global.flag)
    }

    render() {
        console.log(this.state.data)
      return (
        <React.Fragment>
            <div>
                <Grid container spacing={16} justify="center" alignItems="center">
                    <ReactSearchBox
                        placeholder="Search for a company"
                        data={this.state.data}
                        onSelect={record => this.fetchData(record)}
                        onFocus={() => {
                            console.log('This function is called when is focused')
                        }}
                        onChange={value => console.log(value)}
                        fuseConfigs={{
                        threshold: 0.05,
                        }}
                    />
                {this.state.show && <Display />}
                </Grid>
            </div>
        </React.Fragment>
    
    )
    }
  }