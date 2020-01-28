import React from 'react';
import { Redirect } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';

import serverUrl from '../config';

import Cookies from 'js-cookie';
import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';

export default class Genres extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			redirect: false,
			content: null,
			genreTouched: false
		};
	}

	async getGenres(token) {
		let rawResponse = await fetch(`${serverUrl}/api/genre`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${token}`,
				Accept: '*/*'
			}
		});

		let content = await rawResponse.json();
		if (content.status !== 'success') throw Error();
		console.log(content);
		return content;
	}

	componentDidMount() {
		const token = Cookies.get('TOKEN');
		console.log(token);

		this.getGenres(token)
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
		this.state.genreTouched = true;
		this.forceUpdate();
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
				this.setState({ loading: false, error: true, redirect: false });
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
			<div>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6'>Reactora</Typography>
					</Toolbar>
				</AppBar>
				<Container maxWidth='md' style={{}}>
					<Typography variant='h3' align='center'>
						Your Genres
					</Typography>

					<div
						style={{
							maxWidth: '100%',
							display: 'flex',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center'
						}}>
						{this.state.content.map((g, i) => (
							<Chip
								label={g[0]}
								key={i}
								style={{
									margin: '0.5rem',
									padding: '1rem'
								}}
								color={g[1] ? 'primary' : 'secondary'}
								clickable
								onClick={() => this.handleGenreClick(i)}
							/>
						))}
					</div>

					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
						<Button
							variant='contained'
							color='primary'
							disabled={!this.state.genreTouched}
							onClick={() => this.handleSubscribeClick()}>
							SUBSCRIBE
						</Button>
					</div>
				</Container>
			</div>
		);
	}
}
