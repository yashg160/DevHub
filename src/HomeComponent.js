import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
export class HomeComponent extends Component {
    render() {
        console.log("CHECK THIS OUT YO " + this.props.location.state.user.data.login )
        return (
            <div>
                <h1>I have arrive :)</h1>
            </div>
        )
    }
}

export default withRouter(HomeComponent);
