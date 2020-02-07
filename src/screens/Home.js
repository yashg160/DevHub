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
import ThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import theme from '../theme';

export default class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			redirect: false,
			firstLogin: false,
			code: '',
			user: null
		};
	}

	async getUserData(code) {
		let rawResponse = await fetch(`${serverUrl}/user/data/${code}`);
		let content = await rawResponse.json();

		console.log(content);
		return content;
	}

	componentDidMount() {
		try {
			let upvotedComments = JSON.parse(localStorage.getItem('UPVOTED_COMMENTS'));
			console.log(upvotedComments);
		}
		catch (error) {
			console.error(error);
			localStorage.setItem('UPVOTED_COMMENTS', JSON.stringify([]));
		}


		if (window.location.href.includes('code')) {
			var code = window.location.href.split('?code=')[1];
			console.log(code);

			this.getUserData(code)
				.then(content => {
					Cookies.set('TOKEN', content.token);
					Cookies.set('USER_NAME', content.data.login);
					this.setState({
						user: content.data,
						loading: false,
						redirect: true,
						firstLogin: content.first_login
					});
				})
				.catch(error => {
					console.error(error);
					this.setState({ loading: false });
				});
		} else {
			this.setState({ loading: false });

			// Later add logic to authorize user. If authorized, then automatically redirect to the dashboard
		}
	}

	render() {
		if (this.state.loading)
			return <Backdrop color='#fff' open={this.state.loading} />;

		if (this.state.redirect) {
			if (!this.state.firstLogin)
				return (
					<Redirect
						to={{
							pathname: '/dashboard'
						}}
					/>
				);
			else
				return (
					<Redirect
						to={{
							pathname: '/genres'
						}}
					/>
				);
		}

		return (
			<ThemeProvider theme={theme.theme}>
				<div
					style={{
						backgroundImage: `url(${homeBackground})`,
						backgroundSize: 'contain',
						height: '100vh',
						width: '100vw',
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
							color: '#fff',
							textShadow: '0 0 1rem #000',
							padding: '1rem'
						}}>
						DevHub
					</Typography>

					<Typography
						variant='h5'
						align='center'
						style={{
							color: '#fff',
							textShadow: '0 0 0.5rem #000'
						}}>
						A place to better understand coding. Ask more. Know
						more
					</Typography>

					<Link href='https://github.com/login/oauth/authorize?client_id=e97710fdd921e6d456bd'>
						<Button
							variant='contained'
							color='primary'
							style={{
								paddingTop: '16px',
								paddingBottom: '16px',
								paddingLeft: '32px',
								paddingRight: '32px',
								marginTop: '24px',
								textTransform: 'none',
								borderRadius: '3rem',
								alignSelf: 'center',
								color: '#fff'
							}}
							startIcon={<GitHubIcon fontSize='large' />}
							onClick={() => this.setState({ loading: true })}>
							<Typography
								variant='body1'
								style={{ color: '#fff' }}>
								Login with Github
							</Typography>
						</Button>
					</Link>

					<div
						style={{
							marginTop: '40px',
							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
							textShadow: '0 0 0.5rem #000'
						}}>
						<Link
							href='#'
							variant='body1'
							onClick={event => event.preventDefault()}
							style={{
								color: '#fff',
								margin: '20px'
							}}>
							About
						</Link>

						<Link
							href='#'
							variant='body1'
							onClick={event => event.preventDefault()}
							style={{
								color: '#fff',
								margin: '20px'
							}}>
							Help
						</Link>

						<Link
							href='#'
							variant='body1'
							onClick={event => event.preventDefault()}
							style={{
								color: '#fff',
								margin: '20px'
							}}>
							Careers
						</Link>

						<Link
							href='#'
							variant='body1'
							onClick={event => event.preventDefault()}
							style={{
								color: '#fff',
								margin: '20px'
							}}>
							Privacy
						</Link>
					</div>
				</div>
			</ThemeProvider>
		);
	}
}
