import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';

import serverUrl from '../config';


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            user: null,
            loading: true
        }
    }

    async getUserData(code) {
        let rawResponse = await fetch(`${serverUrl}/user/data/${code}`);
        let content = await rawResponse.json();

        console.log(content);
        return content;
    }

    componentDidMount() {

        var code = this.props.location.data.code;
        console.log(code);

        this.getUserData(code)
            .then((user) => this.setState({ user, loading: false}))
            .catch((error) => console.error(error));
    }
    render() {
        console.log(this.props);
        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        return (
            <h1>YO! CHECK THIS OUT YA ALL!</h1>
        )
    }
}