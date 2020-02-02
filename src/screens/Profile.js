import React from 'react';
import Tabs from './tabs/Tabs';
import './styles/tabs.css';
import serverUrl from '../config';
import Cookies from 'js-cookie';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			menuVisible: null,
			user: null,
			questions: null,
			answers: null,
			comments: null,
			upvotedAnswers: null,
			upvotedComments: null,
			requests: null
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
					upvotedAnswers: res.upvoted_answers,
					upvotedComments: res.upvoted_comments,
					requests: res.requested_answers,
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
			<ThemeProvider theme={theme.theme}>
				<div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
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
													menuVisible:
														event.currentTarget
												})
											}>
											<Avatar
												src={this.state.user.avatar_url}
												alt={this.state.user.name}
												style={{
													height: '2.3rem',
													width: '2.3rem'
												}}
											/>
										</div>

										<Button
											variant='contained'
											color='secondary'
											onClick={() =>
												this.setState({
													modalVisible: true
												})
											}
											style={{
												borderRadius: '2rem',
												textTransform: 'none'
											}}>
											<Typography
												variant='body2'
												style={{
													fontWeight: 600
												}}>
												Add Question
											</Typography>
										</Button>
									</div>
								</div>
							</Container>
						</Toolbar>
					</AppBar>
					<Grid
						container
						direction='row'
						style={{ marginTop: '5rem' }}>
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
									style={{
										marginTop: '1rem',
										fontSize: '2rem'
									}}>
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
								<Link
									href={'https://' + this.state.user.blog}
									target='_blank'>
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
								<div
									label='Comments'
									comments={this.state.comments}
									history={this.props.history}>
									Comments
								</div>
								<div
									label='Upvoted Answers'
									upvotedAnswers={this.state.upvotedAnswers}
									history={this.props.history}>
									Upvoted Answers
								</div>
								<div
									label='Upvoted Comments'
									upvotedComments={this.state.upvotedComments}
									history={this.props.history}>
									Upvoted Comments
								</div>
								<div
									label='Requests'
									requests={this.state.requests}
									history={this.props.history}>
									Requests
								</div>
							</Tabs>
						</Grid>
					</Grid>
				</div>
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
						onClick={() => {
							this.setState({ menuVisible: null });
							this.props.history.push(
								`/users/${this.state.user.login}`
							);
						}}>
						<Avatar
							src={this.state.user.avatar_url}
							alt={this.state.user.name}
							style={{
								height: '3rem',
								width: '3rem',
								marginBottom: '0.5rem'
							}}
						/>
						<Typography variant='body1' style={{ fontWeight: 600 }}>
							{this.state.user.name}
						</Typography>
					</MenuItem>
					<MenuItem
						style={{
							paddingTop: '1rem',
							paddingBottom: '1rem',
							paddingLeft: '4rem',
							paddingRight: '4rem'
						}}
						onClick={() => {
							this.setState({ menuVisible: null });
							this.props.history.push(`/dashboard`);
						}}>
						Dashboard
					</MenuItem>

					<MenuItem
						style={{
							paddingTop: '1rem',
							paddingBottom: '1rem',
							paddingLeft: '4rem',
							paddingRight: '4rem'
						}}
						onClick={() => {
							this.setState({ menuVisible: null });
							this.props.history.push(`/genres`);
						}}>
						Genres
					</MenuItem>
					<MenuItem
						style={{
							paddingTop: '1rem',
							paddingBottom: '1rem',
							paddingLeft: '4rem',
							paddingRight: '4rem'
						}}
						onClick={() => {
							this.setState({ menuVisible: null });
							this.props.history.push(
								`/users/${this.state.user.login}`
							);
						}}>
						Profile
					</MenuItem>
					<MenuItem
						style={{
							paddingTop: '1rem',
							paddingBottom: '1rem',
							paddingLeft: '4rem',
							paddingRight: '4rem'
						}}
						onClick={() => this.setState({ menuVisible: null })}>
						Sign Out
					</MenuItem>
				</Menu>
			</ThemeProvider>
		);
	}
}
