import React from 'react';
import { Redirect } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import serverUrl from '../config';
import Cookies from 'js-cookie';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';

export default class Genres extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false,
			redirect: false,
			content: null,
			genreTouched: false,
			snackbar: false,
			snackbarMess: ''
		};
	}

	async getUser(userName, token) {
		let rawResponse = await fetch(serverUrl + `/user/${userName}`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		let res = await rawResponse.json();
		console.log(res);
		this.setState({ user: res.data });
		if (res.status !== 'success') throw Error('ERR_USER_FETCH');
		return;
	}

	async getGenres(token) {
		let rawResponse = await fetch(`${serverUrl}/api/genre`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json'
			}
		});

		let content = await rawResponse.json();
		if (content.status !== 'success') throw Error();
		console.log(content);
		return content;
	}

	componentDidMount() {
		const token = Cookies.get('TOKEN');
		const userName = Cookies.get('USER_NAME');
		console.log(token);

		this.getUser(userName, token)
			.then(() => this.getGenres(token))
			.then(content => {
				var result = Object.entries(content.data);
				this.setState({ content: result, loading: false });
				console.log(this.state);
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false });
			});
	}

	handleGenreClick(i) {
		if (this.state.content[i][1]) {
			this.state.content[i][1] = false;
		} else {
			this.state.content[i][1] = true;
		}
		this.setState({ genreTouched: true });
	}

	async subscribeToGenres(token, subscribedGenres) {
		let rawResponse = await fetch(serverUrl + '/api/genres/subscribe', {
			method: 'POST',
			headers: {
				Authorization: `Token ${token}`,
				Accept: '*/*',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				genres: subscribedGenres
			})
		});

		let res = await rawResponse.json();
		if (res.status !== 'success') throw Error();
		return res;
	}

	handleSubscribeClick() {
		this.setState({ loading: true, error: false });

		//Get the token from cookies
		const token = Cookies.get('TOKEN');
		console.log(token);

		//Create the list of genres to be sent to backend that the user has subscribed to
		let genres = [];
		this.state.content.map(g => {
			if (g[1]) genres.push(g[0]);
			return null;
		});
		var subscribedGenres = genres.join(',');
		console.log('Subscribed to genres: ', subscribedGenres);

		this.subscribeToGenres(token, subscribedGenres)
			.then(res => {
				console.group(res);
				this.setState({ loading: false, error: false, redirect: true });
			})
			.catch(error => {
				console.error(error);
				this.setState({
					loading: false,
					error: true,
					redirect: false,
					snackbar: true,
					snackbarMess: 'An error occurred. Please try again'
				});
			});
	}

	render() {
		if (this.state.loading) return <Backdrop open={this.state.loading} />;
		else if (this.state.error) return <h1>There was an error</h1>;
		else if (this.state.redirect)
			return (
				<Redirect
					to={{
						pathname: '/dashboard'
					}}
				/>
			);
		return (
			<ThemeProvider theme={theme.theme}>
				<AppBar position='fixed'>
					<Toolbar variant='regular' color='primary'>
						<Container maxWidth='lg'>
							<div
								style={{
									display: 'flex',
									flexGrow: 1,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between'
								}}>
								<Typography
									variant='h5'
									style={{ color: '#fff' }}>
									Reactora
								</Typography>

								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center'
									}}>
									<div
										className={'link-div'}
										style={{
											marginRight: '1rem',
											padding: '0.5rem'
										}}
										onClick={event =>
											this.setState({
												menuVisible: event.currentTarget
											})
										}>
										<Avatar
											src={this.state.user.avatar_url}
											style={{
												height: '2.3rem',
												width: '2.3rem'
											}}>
											{this.state.user.name}
										</Avatar>
									</div>
								</div>
							</div>
						</Container>
					</Toolbar>
				</AppBar>
				<Container maxWidth='md' style={{ marginTop: '6rem' }}>
					<Typography variant='h4' align='center'>
						Your Genres
					</Typography>
					<Typography
						variant='h6'
						align='center'
						style={{ fontWeight: 500 }}>
						Select some things you want to read about
					</Typography>
					<div
						style={{
							maxWidth: '100%',
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: '2rem'
						}}>
						{this.state.content.map((g, i) => (
							<Chip
								label={g[0]}
								key={i}
								style={{
									margin: '0.5rem',
									padding: '1rem',
									color: '#fff'
								}}
								color={g[1] ? 'secondary' : 'primary'}
								clickable
								onClick={() => this.handleGenreClick(i)}
							/>
						))}
					</div>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '1.5rem'
						}}>
						<Button
							variant='contained'
							color='primary'
							disabled={!this.state.genreTouched}
							onClick={() => this.handleSubscribeClick()}
							style={{
								borderRadius: '1.5rem',
								color: '#fff',
								paddingLeft: '2rem',
								paddingRight: '2rem',
								paddingTop: '0.5rem',
								paddingBottom: '0.5rem',
								textTransform: 'none'
							}}>
							Subscribe
						</Button>
					</div>
				</Container>
				<Menu
					id='main-menu'
					anchorEl={this.state.menuVisible}
					keepMounted
					open={Boolean(this.state.menuVisible)}
					onClose={() => this.setState({ menuVisible: null })}>
					<MenuItem
						style={{
							paddingTop: '1rem',
							paddingBottom: '1rem',
							paddingLeft: '4rem',
							paddingRight: '4rem',
							display: 'flex',
							flexDirection: 'column'
						}}
						onClick={() => this.setState({ menuVisible: null })}>
						<Avatar
							src={this.state.user.avatar_url}
							alt={this.state.user.name}
							style={{
								height: '3rem',
								width: '3rem',
								marginBottom: '0.5rem'
							}}
						/>
						<Typography variant='body2'>Logged in as</Typography>
						<Typography variant='body1' style={{ fontWeight: 600 }}>
							{this.state.user.name}
						</Typography>
					</MenuItem>
				</Menu>
				<Snackbar
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					key={'profile-snackbar'}
					open={this.state.snackbar}
					autoHideDuration={5000}
					onClose={() => this.setState({ snackbar: false })}>
					<SnackbarContent
						style={{ backgroundColor: '#41b578', color: '#fff' }}
						message={this.state.snackbarMess}
						action={
							<IconButton
								color='secondary'
								onClick={() =>
									this.setState({ snackbar: false })
								}>
								<CloseIcon />
							</IconButton>
						}
					/>
				</Snackbar>
			</ThemeProvider>
		);
	}
}
