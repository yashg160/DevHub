import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';

import Cookies from 'js-cookie';


export default class Genres extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        }
    }

    async getGenres(token) {

    } 

    componentDidMount() {
        console.log(Cookies.get('TOKEN'));
    }

    render() {
        return (
            <h1>This is genres screen</h1>
        )
    }
}