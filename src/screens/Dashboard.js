import React from 'react';
import './styles/dashboard.css';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Link from '@material-ui/core/Link';
import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

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
			next: null,
			modalVisible: false,
			newQuestion: '',
			newQuestionError: false,
			showSnackbar: false,
			messageSnackbar: 'Snackbar messsage'
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

		if (res.status !== 'success') throw Error('ERR_USER_FETCH');
		return res.data;
	}

	async checkQuestion() {
		const { newQuestion } = this.state;

		if (newQuestion === '') throw Error('ERR_QUESTION');
	}

	async postQuestion(token) {
		let rawResponse = await fetch(serverUrl + '/api/questions', {
			method: 'POST',
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: this.state.newQuestion
			})
		});

		let res = await rawResponse.json();
		console.group(res);
		if (res.status !== 'success') throw Error('ERR_SERVER');
		return res;
	}

	handleAskQuestion() {
		var token = Cookies.get('TOKEN');
		console.log(token);

		/*
            In this method we handle the posting of a new question. First task is to check the string for any error.
            If there is an error, throw the error and catch it later in th catch callback
        */
		this.setState({
			loading: true,
			newQuestionError: false,
			showSnackbar: false
		});

		this.checkQuestion()
			.then(() => this.postQuestion(token))
			.then(res => {
				this.setState({
					loading: false,
					newQuestionError: false,
					showSnackbar: true,
					messageSnackbar: 'Question posted successfully.',
					modalVisible: false,
					newQuestion: ''
				});
			})
			.catch(error => {
				console.error(error);
				if (error.message == 'ERR_SERVER') {
					this.setState({
						loading: false,
						newQuestionError: false,
						showSnackbar: true,
						messageSnackbar: 'An error occurred. Try again.'
					});
				} else if (error.message == 'ERR_QUESTION') {
					this.setState({
						loading: false,
						newQuestionError: true,
						showSnackbar: false,
						messageSnackbar: 'An error occurred. Try again.'
					});
				}
			});
	}

	async followClick(i) {
		/* 
		Here i is the index of the question in results array in state 
		Use it to refer to which question to follow
		*/

		//Get the token as cookie
		/* var token = Cookies.get('TOKEN');

		let rawResponse = await fetch(
			serverUrl + `/api/questions/${this.state.result[i].url}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					followed: 'True',
					unfollowed: 'False'
				})
			}
		);

		let res = await rawResponse.json();
		console.group(res); */
		console.log('Follow: To be implemented');
	}

	componentDidMount() {
		var userName = Cookies.get('USER_NAME');
		var token = Cookies.get('TOKEN');
		console.log(userName);
		console.log(token);

		this.getUser(userName, token)
			.then(user => {
				this.fetchResult();
				console.group(user);
				this.setState({ user });
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: true, loading: false });
			});
	}
	render() {
		if (this.state.loading)
			return <Backdrop color='#fff' open={this.state.loading} />;
		else if (this.state.error) return <h1>There was an error</h1>;

		return (
			<div style={{ backgroundColor: '#f7f7f7' }}>
				<AppBar position='fixed'>
					<Toolbar variant='dense'>
						<Container maxWidth='lg'>
							<div
								style={{
									display: 'flex',
									flexGrow: 1,
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}>
								<Typography variant='h5'>Reactora</Typography>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row'
									}}>
									<Link
										style={{
											color: '#f01818',
											marginRight: '2rem'
										}}
										onClick={() =>
											this.props.history.push(
												'/dashboard'
											)
										}>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center'
											}}>
											<DashboardIcon />
											<Typography
												variant='body1'
												style={{
													fontWeight: 600,
													marginLeft: '0.5rem'
												}}>
												Dashboard
											</Typography>
										</div>
									</Link>

									<Link
										style={{
											color: '#fff',
											marginLeft: '2rem'
										}}
										onClick={() =>
											this.props.history.push('/genres')
										}>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center'
											}}>
											<GroupIcon />
											<Typography
												variant='body1'
												style={{
													fontWeight: 600,
													marginLeft: '0.5rem'
												}}>
												Genres
											</Typography>
										</div>
									</Link>
								</div>
								<Button
									variant='contained'
									onClick={() =>
										this.setState({ modalVisible: true })
									}
									style={{ position: 'relative' }}>
									<Typography
										variant='body2'
										style={{
											fontWeight: 600,
											textTransform: 'capitalize'
										}}>
										Add Question
									</Typography>
								</Button>
							</div>
						</Container>
					</Toolbar>
				</AppBar>
				<Container
					maxWidth='md'
					style={{
						paddingTop: '2rem',
						paddingBottom: '2rem',
						marginTop: '3rem'
					}}>
					<div
						style={{
							padding: '1rem',
							backgroundColor: '#fff',
							height: '100%',
							borderRadius: '0.5rem',
							marginBottom: '2rem',
							color: '#bababa',
							borderStyle: 'solid',
							borderColor: '#bababa',
							borderWidth: '0.1rem'
						}}>
						<Typography variant='body1'>User Name</Typography>
						<Link
							onClick={() =>
								this.setState({ modalVisible: true })
							}
							color='inherit'>
							<Typography variant='h4'>
								What is your question or link?
							</Typography>
						</Link>
					</div>

					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: '2rem'
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
								<ExpansionPanel
									key={i}
									style={{
										marginBottom: '2rem',
										padding: '1rem'
									}}>
									<ExpansionPanelSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls={`panel${i}-control`}
										id={`panel${i}-header`}>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column'
											}}>
											<Typography variant='subtitle2'>
												Recommended for you
											</Typography>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'center',
													marginTop: '0.3rem',
													marginBottom: '1rem'
												}}>
												{res.genres.map((g, i) => (
													<Typography
														key={i}
														variant='body2'
														style={{
															marginRight: '1rem',
															color: '#a3a3a3'
														}}>
														&#9679; {g}
													</Typography>
												))}
											</div>
											<Typography
												className='question-link'
												variant='h6'
												style={{
													textTransform: 'capitalize',
													fontWeight: 700
												}}
												onClick={() =>
													this.props.history.push(
														`/questions/${res.url}`
													)
												}>
												{res.question}
											</Typography>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													marginTop: '1rem'
												}}>
												<Button
													variant='text'
													style={{ color: '#919191' }}
													startIcon={<CreateIcon />}
													onClick={event => {
														event.stopPropagation();
														this.props.history.push(
															{
																pathname: `questions/${res.url}/answer`,
																state: {
																	question: res
																}
															}
														);
													}}>
													<Typography
														variant='body2'
														style={{
															fontWeight: 600,
															textTransform:
																'capitalize'
														}}>
														Answer
													</Typography>
												</Button>
												<Button
													variant='text'
													style={{ color: '#919191' }}
													startIcon={<RssFeedIcon />}
													onClick={e =>
														this.followClick(i)
													}>
													<Typography
														variant='body2'
														style={{
															fontWeight: 600,
															textTransform:
																'capitalize'
														}}>
														Follow &#183;{' '}
														{
															res.followers_list
																.length
														}
													</Typography>
												</Button>
												<Button
													variant='text'
													style={{ color: '#919191' }}
													startIcon={
														<EmojiPeopleIcon />
													}>
													<Typography
														variant='body2'
														style={{
															fontWeight: 600,
															textTransform:
																'capitalize'
														}}>
														Request
													</Typography>
												</Button>
											</div>
										</div>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column'
											}}>
											<Typography variant='body1'>
												{res.answer.author_name}
											</Typography>
											<Typography variant='subtitle2'>
												Updated at{' '}
												{new Date(
													res.answer.updated_at
												).toString()}
											</Typography>
											<Typography
												variant='body1'
												style={{ marginTop: '2rem' }}>
												{res.answer.answer}
											</Typography>
										</div>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							))}
						</InfiniteScroll>
					</div>
				</Container>
				<Modal
					aria-labelledby='modal-question'
					aria-describedby='modal-ask-question'
					open={this.state.modalVisible}
					onClose={() => this.setState({ modalVisible: false })}
					closeAfterTransition
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					BackdropComponent={Backdrop}
					BackdropProps={{ timeout: 500 }}>
					<Fade in={this.state.modalVisible}>
						<div
							style={{
								padding: '1.5rem',
								backgroundColor: '#fff',
								width: '50%'
							}}>
							<div
								style={{
									width: '100%',
									height: '2rem',
									backgroundColor: '#e3e3e3'
								}}>
								<Typography variant='h6'>
									Add Question
								</Typography>
							</div>

							<div>
								<Typography
									variant='h6'
									style={{ fontWeight: 700 }}>
									Tips on getting good answers quickly
								</Typography>
								<Typography variant='body1'>
									Make sure your question hasn't been asked
									already
								</Typography>
								<Typography variant='body1'>
									Keep your question short and to the point
								</Typography>
								<Typography variant='body1'>
									Double-check grammar and spelling
								</Typography>
							</div>

							<div>
								<Typography variant='subtitle1'>
									User Name asked
								</Typography>
								<TextField
									id='question'
									label='Your Question'
									InputProps={{
										style: { fontSize: 28, fontWeight: 600 }
									}}
									placeholder={
										'Start you question with "What," "Why," or "How."'
									}
									multiline
									rowsMax='3'
									fullWidth
									value={this.state.newQuestion}
									onChange={event =>
										this.setState({
											newQuestion: event.target.value
										})
									}
									onFocus={() =>
										this.setState({
											newQuestionError: false
										})
									}
									error={this.state.newQuestionError}
									helperText={
										this.state.newQuestionError
											? 'Please check your question'
											: ''
									}
								/>
							</div>
							<div
								style={{
									padding: '2rem',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center'
								}}>
								<Button
									variant='text'
									onClick={() =>
										this.setState({ modalVisible: false })
									}
									style={{ marginRight: '0.2rem' }}>
									Cancel
								</Button>
								<Button
									variant='contained'
									onClick={() => this.handleAskQuestion()}
									style={{ marginLeft: '0.2rem' }}>
									Add question
								</Button>
							</div>
						</div>
					</Fade>
				</Modal>
				<Snackbar
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left'
					}}
					open={this.state.showSnackbar}
					autoHideDuration={5000}
					onClose={() => this.setState({ showSnackbar: false })}
					ContentProps={{
						'aria-describedby': 'messsage-snackbar',
						style: { backgroundColor: '#fff' }
					}}
					message={
						<span id='message-snackbar' sty>
							<Typography
								variant='body1'
								style={{ color: '#000' }}>
								{this.state.messageSnackbar}
							</Typography>
						</span>
					}
					transitionDuration={{
						enter: 300,
						exit: 300
					}}
					style={{
						backgroundColor: '#fff'
					}}
					action={[
						<IconButton
							key='close'
							aria-label='close'
							color='secondary'
							onClick={() =>
								this.setState({ showSnackbar: false })
							}>
							<CloseIcon />
						</IconButton>
					]}></Snackbar>
			</div>
		);
	}
}
