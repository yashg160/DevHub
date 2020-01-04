import React, {Component} from 'react';
import Axios from 'axios';
import {Redirect, withRouter} from 'react-router-dom';
import logo from './logo.svg';

class MainComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             redirect : false,
             data : []
        }
    }
    
    async componentDidMount() {
        if(window.location.href.includes('code')) {
            var code = window.location.href.split('?code=')[1];
            console.log(code);
            let data;
            await Axios.get(`http://localhost:8000/user/data/${code}`)
            .then((res) => {
                console.log(res.data)
                this.setState({
                    data : res.data,
                    redirect : true
                })
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }
    render() {
        if(this.props.login) {
            if(this.state.redirect) {
                return <Redirect to={{
                    pathname: '/home',
                    state: { user: this.state.data }
                }}
                />
            }
        }
        return (
            <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer" 
                >
                Learn React
                </a>
            </header>
            <a href="https://github.com/login/oauth/authorize?client_id=e97710fdd921e6d456bd">Sign In with Github</a>
            </div>
        );
    }  
}
export default withRouter(MainComponent);