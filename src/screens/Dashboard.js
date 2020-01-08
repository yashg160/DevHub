import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';

import Cookies from 'js-cookie';


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            loading: false
        }
    }

    componentDidMount() {

    }

    render() {
        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        return (
            <h1>This is the dashboard</h1>
        )
    }
}