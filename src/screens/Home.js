import React from 'react';
import { Redirect } from 'react-router-dom';
import homeBackground from '../resources/home-background.png';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GitHubIcon from '@material-ui/icons/GitHub';
import Backdrop from '@material-ui/core/Backdrop';
import Link from '@material-ui/core/Link';

import Cookies from 'js-cookie';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            redirect: false
        }
    }

    componentDidMount() {
        if (window.location.href.includes('code')) {
            var code = window.location.href.split('?code=')[1];
            console.log(code);

            //Cookies.set('CODE', code);

            this.setState({ redirect: true, loading: false});
        }
        else if (Cookies.get('CODE') != null) {

            this.setState({ redirect: true, loading: false });
        }

        else {
            this.setState({ loading: false });
        }
    }

    render() {

        if (this.state.loading)
            return (
                <Backdrop color='#fff' open={this.state.loading}/>
            )
        
        if (this.state.redirect) {
            return (
                <Redirect to={{
                    pathname: '/dashboard'
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