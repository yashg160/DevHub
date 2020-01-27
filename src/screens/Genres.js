import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Chip from '@material-ui/core/Chip';

import serverUrl from '../config';

import Cookies from 'js-cookie';
import { Container } from '@material-ui/core';

export default class Genres extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			content: null
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

	render() {
		if (this.state.loading) return <Backdrop open={this.state.loading} />;
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
									padding: '1rem',
									backgroundColor: g[1] ? 'secondary' : null
								}}
							/>
						))}
					</div>
				</Container>
			</div>
		);
	}
}
