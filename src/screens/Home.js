import React from 'react';
import { Redirect } from 'react-router-dom';
import homeBackground from '../resources/home-background.png';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import Backdrop from '@material-ui/core/Backdrop';
import Link from '@material-ui/core/Link';

import Cookies from 'js-cookie';

import serverUrl from '../config';


export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            redirect: false,
            firstLogin: false,
            error: false,
            user: null
        }
    }

    async getUserData(code) {
        let rawResponse = await fetch(`${serverUrl}/user/data/${code}`);
        let content = await rawResponse.json();

        console.log(content);

        // Save the token for later use
        Cookies.set('TOKEN', content.token);
        return content;
    }

    componentDidMount() {

        /*
        First thing to check which url the page is rendered at.

        If the URL contains the code parameter, then that means that the user has just logged in, redirected from Github auth.
        If so, then check if the user is new or already registered. If new, then we move to the screen to select genres.
        Else, we move to the dashboard screen to show more content

        */
        
        if (window.location.href.includes('code')) {
            var code = window.location.href.split('?code=')[1];
            console.log(code);

            this.getUserData(code)
                .then((user) => {
                /* Fetch request was successfull. Check if new user was created or not */
                    
                    if (user.first_login) {
                        //New user was created or this is a first time login
                        this.setState({ firstLogin: true, redirect: true, loading: false, user });   
                    }
                    else {
                        // Old user has logged in
                        this.setState({ firstLogin: false, redirect: true, loading: false, user });
                    }
                    
                })
                .catch((error) => {
                    //Error in fetching. Display some feedback
                    //TODO: Snackbar
                    console.error(error);
                    this.setState({ error: true, loading: false, redirect: false });
                });
        }

        else if (Cookies.get('TOKEN') != null) {

            /*
            TOKEN cookie already exists. So, user is already logged in. Directly move to the dashboard 
            TODO: Later change this logic to make an API call to verify the token. If verified, we will move dashboard.
            Else, stay on the home screen
            */

            this.setState({ firstLogin: false, redirect: true, loading: false, error: false });
        }

        else {
            /* Home screen opened for the first time. Simply display the home screen */
            this.setState({ redirect: false, error: false, loading: false });
        }
    }

    render() {

        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        else if (this.state.redirect && !this.state.firstLogin)
            return (
                <Redirect to={{
                    pathname: '/genres'
                }}
                />
            )      
        
        else if (this.state.redirect && this.state.firstLogin)
            return (
                <Redirect to={{
                    pathname: '/genres'
                }}
                />
            )

        return (
            <div style={{
                backgroundImage: `url(${homeBackground})`,
                height: '100vh',
                width: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>

                <div style={{
                    width: '50%',
                    height: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <Typography
                        variant='h1'
                        align='center'
                        style={{
                        marginTop: '16px',
                        marginBottom: '16px',
                        color: '#fff'
                    }}>
                        Reactora
                    </Typography>

                    <Typography
                        variant='h5'
                        align='center'
                        style={{
                            color: '#fff'
                        }}>
                        A place to better understand the world
                    </Typography>

                    <Typography
                        variant='h5'
                        align='center'
                        style={{
                            color: '#fff',
                            marginTop: '4px'
                        }}>
                        Ask more. Know more.
                    </Typography>

                    <Button
                        variant='contained'
                        style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingLeft: '32px',
                            paddingRight: '32px',
                            marginTop: '40px',
                            textTransform: 'none',
                            borderRadius: '24px'
                        }}
                        startIcon={<GitHubIcon/>}
                        onClick={() => this.setState({ loading: true})}
                    >
                        <Link
                            href='https://github.com/login/oauth/authorize?client_id=e97710fdd921e6d456bd'
                            variant='body1'
                            style={{
                                color: '#000',
                            }}
                        >
                            Continue with Github
                        </Link>
            
                    </Button>

                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems:'center'
                    }}>

                        <Link
                            href='#'
                            variant='body1'
                            onClick={(event) => event.preventDefault()}
                            style={{
                                color: '#fff',
                                margin: '20px'
                            }}
                        >
                            About
                        </Link>

                        <Link
                            href='#'
                            variant='body1'
                            onClick={(event) => event.preventDefault()}
                            style={{
                                color: '#fff',
                                margin: '20px'
                            }}
                        >
                            Help
                        </Link>

                        <Link
                            href='#'
                            variant='body1'
                            onClick={(event) => event.preventDefault()}
                            style={{
                                color: '#fff',
                                margin: '20px'
                            }}
                        >
                            Careers
                        </Link>

                        <Link
                            href='#'
                            variant='body1'
                            onClick={(event) => event.preventDefault()}
                            style={{
                                color: '#fff',
                                margin: '20px'
                            }}
                        >
                            Privacy
                        </Link>

                    </div>

                </div>

            </div>
        )
    }
}