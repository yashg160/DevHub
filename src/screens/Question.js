import React from 'react';
import Cookies from 'js-cookie';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import EditIcon from '@material-ui/icons/Edit';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import serverUrl from '../config';
import theme from '../theme';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false,
			menuVisible: null,
			question: null
		};
	}

	editAnswerClick(i) {
		// Here i is the index of the question to edit the answer of
		console.log('Clicked editAnswerClick');
		console.log(i);
		this.props.history.push({
			pathname: `/questions/${this.state.question.url}/answer`,
			state: {
				editAnswer: true,
				answerId: this.state.question.all_answers[i].id
			}
		});
	}

	async getQuestionData(token, questionUrl) {
		let rawResponse = await fetch(
			serverUrl + `/api/questions/${questionUrl}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			}
		);

		let res = await rawResponse.json();
		console.log(res);
		if (res.status !== 'success') throw Error('ERR_SERVER');
		return res;
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
		if (res.status !== 'success') throw Error('ERR_USER_FETCH');
		this.setState({ user: res.data });
		return;
	}

	componentDidMount() {
		var token = Cookies.get('TOKEN');
		var userName = Cookies.get('USER_NAME');
		console.log(userName);
		console.log(token);

		var questionUrl = this.props.match.params.questionUrl;
		console.log(questionUrl);

		this.getUser(userName, token)
			.then(() => this.getQuestionData(token, questionUrl))
			.then(res => {
				this.setState({
					loading: false,
					error: false,
					question: res.data
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

		return (
			<ThemeProvider theme={theme.theme}>
				<div style={{ backgroundColor: '#f7f7f7' }}>
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
												style={{
													height: '2.3rem',
													width: '2.3rem'
												}}>
												{this.state.user.name}
											</Avatar>
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
					<Container
						maxWidth='md'
						style={{
							marginTop: '3rem',
							padding: '2rem'
						}}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center'
							}}>
							{this.state.question.genres.map((g, i) => (
								<Typography
									variant='subtitle2'
									key={i}
									style={{
										backgroundColor: '#e3e3e3',
										padding: '0.5rem',
										marginRight: '1rem'
									}}>
									{g}
									{'   '}
								</Typography>
							))}
						</div>

						<Typography
							variant='h4'
							style={{
								fontWeight: 600,
								textTransform: 'capitalize',
								marginTop: '1rem'
							}}>
							{this.state.question.question}
						</Typography>
						<Typography variant='body2'>
							Asked By {this.state.question.asker_name}
						</Typography>

						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'flex-start',
								marginTop: '0.5rem'
							}}>
							<Button
								variant='text'
								color='primary'
								startIcon={<CreateIcon />}
								onClick={() =>
									this.props.history.push({
										pathname: `/questions/${this.state.question.url}/answer`,
										state: { question: this.state.question }
									})
								}
								style={{ marginRight: '0.5rem' }}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 500,
										fontSize: 18,
										textTransform: 'capitalize'
									}}>
									Answer
								</Typography>
							</Button>
							<Button
								variant='text'
								color='primary'
								startIcon={<RssFeedIcon />}
								onClick={() => this.handleFollowClick()}
								style={{ marginRight: '1rem' }}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 500,
										fontSize: 18,
										textTransform: 'capitalize'
									}}>
									Follow
								</Typography>
							</Button>
							<Button
								variant='text'
								color='primary'
								startIcon={<EmojiPeopleIcon />}
								onClick={() => this.handleRequestClick()}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 500,
										fontSize: 18,
										textTransform: 'capitalize'
									}}>
									Request
								</Typography>
							</Button>
						</div>

						<Typography
							variant='h6'
							style={{ fontWeight: 500, marginTop: '1rem' }}>
							{this.state.question.all_answers.length} Answers
						</Typography>
						<hr></hr>
						{this.state.question.all_answers.map((answer, i) => (
							<div key={i} style={{ marginTop: '1rem' }}>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'flex-start'
									}}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '100%'
										}}>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column'
											}}>
											<Typography
												variant='body1'
												style={{ fontWeight: 600 }}>
												{answer.author_name}
											</Typography>
											<Typography
												variant='subtitle2'
												color='textSecondary'>
												Updated{' '}
												{new Date(
													answer.updated_at
												).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})}
											</Typography>
										</div>

										<Button
											variant='text'
											startIcon={<EditIcon />}
											onClick={() =>
												this.editAnswerClick(i)
											}>
											<Typography
												variant='body2'
												style={{
													fontWeight: 600,
													textTransform: 'capitalize'
												}}>
												Edit Answer
											</Typography>
										</Button>
									</div>

									<Typography
										variant='body1'
										style={{ marginTop: '0.5rem' }}>
										{answer.answer}
									</Typography>
								</div>
								<hr />
							</div>
						))}
					</Container>
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
