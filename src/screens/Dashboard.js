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

    /* async getUserData(code) {
        let rawResponse = await fetch(`${serverUrl}/user/data/${code}`);
        let content = await rawResponse.json();

        console.log(content);
        return content;
    } */

    componentDidMount() {

        // This code will be used later to get the user data again from Github.
        // DO NOT CHANGE

        /* var code = Cookies.get('CODE');
        console.log(code);

        this.getUserData(code)
            .then((user) => this.setState({ user, loading: false}))
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false });
            }); */
        // Rest of the code that is used ti display the content.
        this.setState({ loading: false });
        console.log(this.props.location.state);
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