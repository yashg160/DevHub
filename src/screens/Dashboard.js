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
			result: [],
			hasMore: false,
			next: null
		};
	}

	async getResults(token, url) {
		let rawResponse = await fetch(url, {
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

		/*
        Check for the url in state. If the function is being called for the first time, then "next" will be null in state.

        If "next" already exists, then use that url to fetch the request. Later again set the next url in response in the state.
        */

		let url = serverUrl + '/api/home';
		this.state.next
			? (url = this.state.next)
			: console.log('Fetching from next page');

		this.getResults(token, url)
			.then(res => {
				console.group(res);

				//Push each of the answer in the response to the state
				res.results.map(r => this.state.result.push(r));
				console.log(this.state);

				//Check if "next" url exists in response. If it exists, then set hasMore in state to true.
				//Also store the next url to make future requests for the infinite scrolling
				if (res.next) this.setState({ hasMore: true, next: res.next });
				else this.setState({ hasMore: false, next: null });

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
						}}>
						<InfiniteScroll
							dataLength={this.state.result.length}
							next={() => this.fetchResult()}
							hasMore={this.state.hasMore}
							loader={<h2>Loading...</h2>}
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<b>Yay! You have seen it all</b>
								</p>
							}>
							{this.state.result.map((res, i) => (
								<ExpansionPanel>
									<ExpansionPanelSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls={`panel${i}-control`}
										id={`panel${i}-header`}>
										<Typography variant='h5'>
											{res.question}
										</Typography>
										<Typography variant='body1'>
											Anser by {res.answer.author_name}
										</Typography>
										<Typography variant='body2'>
											Anser by {res.answer.updated_at}
										</Typography>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<Typography>
											{res.answer.answer}
										</Typography>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							))}
						</InfiniteScroll>
					</div>
				</Container>
			</div>
		);
	}
}
