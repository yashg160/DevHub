import React from 'react';
import { Redirect } from 'react-router-dom';
import homeBackground from '../resources/home-background.png';
import serverUrl from '../config';
import Cookies from 'js-cookie';


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import Backdrop from '@material-ui/core/Backdrop';
import Link from '@material-ui/core/Link';



export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            redirect: false,
            firstLogin: false,
            code: '',
            user: null
        }
    }

    async getUserData(code) {
        let rawResponse = await fetch(`${serverUrl}/user/data/${code}`);
        let content = await rawResponse.json();

        console.log(content);
        return content;
    }

    componentDidMount() {

        if (window.location.href.includes('code')) {
            var code = window.location.href.split('?code=')[1];
            console.log(code);

            this.getUserData(code)
                .then((content) => {
                    Cookies.set('TOKEN', content.token);
                    this.setState({ user: content.data, loading: false, redirect: true, firstLogin: content.first_login });
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({ loading: false });
                });

        }

        this.setState({ loading: false });
    }

    render() {

        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        if (this.state.redirect) {

            if(!this.state.firstLogin)
                return (
                    <Redirect to={{
                        pathname: '/dashboard'
                    }}
                    />
                )
            else
                return (
                    <Redirect to={{
                        pathname: '/genres'
                    }}
                    />
                )
        }

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
                        A place to better understand the world. Ask more. Know more
                    </Typography>

                    <Button
                        variant='contained'
                        style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingLeft: '32px',
                            paddingRight: '32px',
                            marginTop: '24px',
                            textTransform: 'none',
                            borderRadius: '24px'
                        }}
                        startIcon={<GitHubIcon fontSize='large' />}
                        onClick={() => this.setState({ loading: true})}
                    >
                        <Link
                            href='https://github.com/login/oauth/authorize?client_id=e97710fdd921e6d456bd'
                            variant='body1'
                            style={{
                                color: '#000',
                            }}
                        >
                            Login with Github
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