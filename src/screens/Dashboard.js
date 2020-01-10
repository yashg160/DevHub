import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';

import Cookies from 'js-cookie';


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user: null,
            loading: true
        }
    }

    

    componentDidMount() {

        var token = Cookies.get('TOKEN');
        console.log(token);
        
    }
    render() {
        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        return (
            <h1>YO! CHECK THIS OUT YA ALL!</h1>
        )
    }
}