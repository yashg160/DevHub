import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import InfiniteScroll from 'react-infinite-scroll-component';

import serverUrl from '../config';

import Cookies from 'js-cookie';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false,
			result: []
		};
	}

	async getResults(token) {
		let rawResponse = await fetch(serverUrl + '/api/home', {
			method: 'GET',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json'
			}
		});

		let res = await rawResponse.json();
		return res;
	}

	fetchResult() {
		var token = Cookies.get('TOKEN');
		console.log(token);

		this.getResults(token)
			.then(res => {
				console.group(res);
				res.results.map(r => this.state.result.push(r));
				console.log(this.state);
				this.setState({ loading: false, error: false });
			})
			.catch(error => {
				this.setState({ error: true, loading: false });
				console.error(error);
			});
	}

	componentDidMount() {
		this.fetchResult();
	}
	render() {
		if (this.state.loading)
			return <Backdrop color='#fff' open={this.state.loading} />;
		else if (this.state.error) return <h1>There was an error</h1>;

		return (
			<div style={{ backgroundColor: '#e3e3e3' }}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6'>Reactora</Typography>
					</Toolbar>
				</AppBar>
				<Container
					maxWidth='md'
					style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
					<div
						style={{
							padding: '1rem',
							backgroundColor: '#fff',
							height: '100%',
							borderRadius: '0.5rem'
						}}>
						<Typography variant='body1'>User Name</Typography>
						<Typography variant='h4'>
							What is your question or link?
						</Typography>
					</div>

					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center'
						}}></div>
				</Container>
			</div>
		);
	}
}
