import React from 'react';
import Tabs from './tabs/Tabs';
import './styles/tabs.css';
import serverUrl from '../config';
import Cookies from 'js-cookie';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			user: null,
			questions: null,
			answers: null,
			comments: null,
			upvotes: null
		};
	}
	async getProfileData(userName, token) {
		let rawResponse = await fetch(serverUrl + `/user/profile/${userName}`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});

		let res = await rawResponse.json();
		console.log(res);
		if (res.status !== 'success') throw Error('ERR_USER_FETCH');
		return res.data;
	}

	componentDidMount() {
		const token = Cookies.get('TOKEN');
		const userName = this.props.match.params.login;
		console.log(token, userName);

		this.getProfileData(userName, token)
			.then(res => {
				this.setState({
					user: res.profile_data,
					questions: res.asked_questions,
					answers: res.answered,
					comments: res.comments,
					upvotes: res.upvoted_answers,
					loading: false,
					error: false
				});
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
		else if (this.state.error) return <h1>There was an error</h1>;
		return (
			<div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
				<Grid container direction='row'>
					<Grid
						container
						direction='column'
						item
						sm={12}
						md={12}
						lg={3}>
						<Avatar
							variant='circle'
							src={this.state.user.avatar_url}
							alt={this.state.user.name}
							style={{
								height: '14rem',
								width: '14rem',
								marginBottom: '1rem'
							}}
						/>
						<div style={{ marginBottom: '0.5rem' }}>
							<Typography
								variant='h5'
								style={{ marginTop: '1rem', fontSize: '2rem' }}>
								{this.state.user.name
									? this.state.user.name
									: null}
							</Typography>
							<Typography variant='h6'>
								{this.state.user.login
									? this.state.user.login
									: null}
							</Typography>
						</div>

						<div style={{ marginTop: '.5rem' }}>
							<Typography variant='subtitle1'>
								{this.state.user.bio
									? this.state.user.bio
									: null}
							</Typography>
							<Typography variant='subtitle1'>
								{this.state.user.company
									? this.state.user.company
									: null}
							</Typography>
							<Typography variant='body2'>
								{this.state.user.location
									? this.state.user.location
									: null}
							</Typography>
							<Link to={this.state.user.blog}>
								<Typography variant='body2'>
									{this.state.user.blog
										? this.state.user.blog
										: null}
								</Typography>
							</Link>
						</div>
					</Grid>
					<Grid item sm={12} md={12} lg={9}>
						<Tabs>
							{/* Here come the tabs for each of the things to be showed in the tab view */}
							<div
								label='Asked Questions'
								questions={this.state.questions}
								history={this.props.history}
							/>
							<div
								label='Answers'
								answers={this.state.answers}
								history={this.props.history}>
								Answers
							</div>
							<div label='Comments'>Comments</div>
							<div label='Upvoted Answers'>Upvoted Answers</div>
							<div label='Upvoted Comments'>Upvoted Comments</div>
							<div label='Requests'>Requests</div>
						</Tabs>
					</Grid>
				</Grid>
			</div>
		);
	}
}
