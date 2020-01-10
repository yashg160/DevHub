import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';

import Cookies from 'js-cookie';


export default class Genres extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            content: null
        }
    }

    async getGenres(token) {
        let rawResponse = await fetch(`${serverUrl}/api/genre`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Accept': '*/*'
            }
        });

        let content = await rawResponse.json();
        console.log(content);
        return content;
    } 

    componentDidMount() {
        const token = Cookies.get('TOKEN');
        console.log(token);

        this.getGenres(token)
            .then((content) => {
                this.setState({ loading: false, content });
            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false });
            });
    }

    render() {
        if (this.state.loading)
            return (
                <Backdrop open={this.state.loading}/>
            )
        return (
            <h1>This is genres screen</h1>
        )
    }
}