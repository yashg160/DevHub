import React from 'react';
import './styles/dashboard.css';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

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
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

import Link from '@material-ui/core/Link';
import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';

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
				if (error.message === 'ERR_SERVER') {
					this.setState({
						loading: false,
						newQuestionError: false,
						showSnackbar: true,
						messageSnackbar: 'An error occurred. Try again.'
					});
				} else if (error.message === 'ERR_QUESTION') {
					this.setState({
						loading: false,
						newQuestionError: true,
						showSnackbar: false,
						messageSnackbar: 'An error occurred. Try again.'
					});
				}
			});
	}

	removeValueFromArray(arr, value) {
		var filteredArray = arr.filter(val => val !== value);
		console.log(filteredArray);
		return filteredArray;
	}

	checkUserInArray(arr) {
		for (let i = 0; i < arr.length; i++)
			if (arr[i] === this.state.user.login) return true;
		return false;
	}

	async followClick(event, url, followers, index) {
		//First we check if the user has already followed the question. If yes, unfollow it. Else, follow the question

		// Also prevent the panel from expanding or shrinking.
		event.stopPropagation();

		//Get the token as cookie
		var token = Cookies.get('TOKEN');

		var userFollowed = this.checkUserInArray(followers);

		if (userFollowed) {
			// User has already followed the question. Remove the follow.
			let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					unfollowed: true
				})
			});

			let res = await rawResponse.json();
			if (res.status === 'success') {
				this.state.result[
					index
				].followers_list = this.removeValueFromArray(
					this.state.result[index].followers_list,
					this.state.user.login
				);
			}
			console.log(res);
		} else {
			// User has followed the question. Add the follow
			let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					followed: true
				})
			});

			let res = await rawResponse.json();
			if (res.status === 'success') {
				this.state.result[index].followers_list.push(
					this.state.user.login
				);
			}
			console.log(res);
		}
		this.forceUpdate();
		return;
	}

	async requestClick(event, url, requested, index) {
		// Stop the panel from expanding or contracting
		event.stopPropagation();
		// First get the token from cookies
		const token = Cookies.get('TOKEN');

		// Check if the user has already requested the answer. If yes, then remove the request on click. Else, add a request.
		const userRequested = this.checkUserInArray(requested);

		if (userRequested) {
			// User has already requested an answer. Remove the request ???
		} else {
			// New request.
			let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					requested: [this.state.user.login]
				})
			});

			let res = await rawResponse.json();
			if (res.status === 'success') {
				this.state.result[index].requested.push(this.state.user.login);
			}
			console.log(res);
		}
		this.forceUpdate();
		return;
	}

	async upvoteAnswerClick(answerId, upvoters, index) {
		// First check if user has already upvoted the answer. If he has, then make unvote the answer. Else, make sure that it is upvoted
		let userUpvoted = false;

		for (let i = 0; i < upvoters.length; i++) {
			if (upvoters[i] === this.state.user.login) userUpvoted = true;
		}

		// Get the token from cookies
		var token = Cookies.get('TOKEN');
		console.log(token);
		console.log(userUpvoted);
		if (userUpvoted) {
			// User has already upvoted. Remove the upvote
			let rawResponse = await fetch(
				serverUrl + `/api/answers/${answerId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Token ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						remove_upvote: true
					})
				}
			);
			let res = await rawResponse.json();
			if (res.status === 'success') {
				this.state.result[
					index
				].answer.upvoters = this.removeValueFromArray(
					this.state.result[index].answer.upvoters,
					this.state.user.login
				);
			}
			console.log(res);
		} else {
			// Upvote the answer by this user
			let rawResponse = await fetch(
				serverUrl + `/api/answers/${answerId}`,
				{
					method: 'PUT',
					headers: {
						Authorization: `Token ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						upvote: true
					})
				}
			);

			let res = await rawResponse.json();
			if (res.status === 'success')
				this.state.result[index].answer.upvoters.push(
					this.state.user.login
				);
			console.log(res);
		}
		this.forceUpdate();
		return;
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
			<div style={{ backgroundColor: '#eeeeee' }}>
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
										color='inherit'
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
												marginRight: '0.5rem',
												borderRadius: '0.2rem',
												padding: '0.2rem',
												color: '#'
											}}
											className='link-div'>
											<DashboardIcon
												style={{
													height: '2rem',
													width: '2rem',
													marginRight: '0.2rem'
												}}
											/>
											<Typography
												variant='body1'
												style={{
													fontWeight: 600
												}}>
												Dashboard
											</Typography>
										</div>
									</Link>

									<Link
										color='inherit'
										onClick={() =>
											this.props.history.push('/genres')
										}>
										<div
											style={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												marginLeft: '0.5rem',
												padding: '0.2rem',
												borderRadius: '0.2rem'
											}}
											className='link-div'>
											<GroupIcon
												style={{
													height: '2rem',
													width: '2rem',
													marginRight: '0.2rem'
												}}
											/>
											<Typography
												variant='body1'
												style={{
													fontWeight: 600
												}}>
												Genres
											</Typography>
										</div>
									</Link>
								</div>

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
										}}>
										<Avatar
											src={this.state.user.avatar_url}
											alt={this.state.user.name}
											style={{
												height: '2rem',
												width: '2rem'
											}}
										/>
									</div>

									<Button
										variant='contained'
										onClick={() =>
											this.setState({
												modalVisible: true
											})
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
							</div>
						</Container>
					</Toolbar>
				</AppBar>
				<Container
					maxWidth='lg'
					style={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'center',
						paddingLeft: '4rem',
						paddingRight: '4rem',
						paddingBottom: '4rem'
					}}>
					<div
						className='hidden'
						style={{
							flex: 1,
							marginTop: '4rem',
							marginRight: '2rem'
						}}>
						<div>
							<Typography variant='h5'>
								This div will contain some other content such as
								related questions or feed.
							</Typography>
						</div>
					</div>

					<div
						style={{
							flex: 3,
							maxWidth: '75%',
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
							loader={
								<div
									style={{
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center'
									}}>
									<CircularProgress
										color='secondary'
										style={{ margin: '2rem' }}
									/>
								</div>
							}
							endMessage={
								<p style={{ textAlign: 'center' }}>
									<b>Yay! You have seen it all</b>
								</p>
							}>
							<div
								style={{
									marginTop: '4rem',
									backgroundColor: '#fff',
									border: '0.2rem solid #bababa',
									borderRadius: '1rem',
									color: '#8a8a8a',
									width: '90%',
									padding: '1rem',
									marginBottom: '3rem'
								}}>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center'
									}}>
									<Avatar
										src={this.state.user.avatar_url}
										alt={this.state.user.name}
										style={{
											height: '3rem',
											width: '3rem',
											marginRight: '1rem'
										}}
									/>
									<Typography variant='body1'>
										{this.state.user.name}
									</Typography>
								</div>
								<Typography
									variant='h6'
									onClick={() =>
										this.setState({ modalVisible: true })
									}
									className='question-link'
									style={{
										fontWeight: 600,
										marginTop: '.5rem'
									}}>
									What is question today?
								</Typography>
							</div>
							{this.state.result.map((res, i) => (
								<ExpansionPanel
									key={i}
									style={{
										marginBottom: '2rem',
										padding: '0.5rem'
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
													style={{
														color: '#919191'
													}}
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

												{this.checkUserInArray(
													res.followers_list
												) ? (
													<Button
														variant='text'
														style={{
															color: '#54e1e3'
														}}
														startIcon={
															<RssFeedIcon />
														}
														onClick={e =>
															this.followClick(
																e,
																res.url,
																res.followers_list,
																i
															)
														}>
														<Typography
															variant='body2'
															style={{
																fontWeight: 600,
																textTransform:
																	'capitalize'
															}}>
															Unfollow &#183;{' '}
															{
																res
																	.followers_list
																	.length
															}
														</Typography>
													</Button>
												) : (
													<Button
														variant='text'
														style={{
															color: '#919191'
														}}
														startIcon={
															<RssFeedIcon />
														}
														onClick={e =>
															this.followClick(
																e,
																res.url,
																res.followers_list,
																i
															)
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
																res
																	.followers_list
																	.length
															}
														</Typography>
													</Button>
												)}
												{this.checkUserInArray(
													res.requested
												) ? (
													<Button
														variant='text'
														style={{
															color: '#54e1e3'
														}}
														startIcon={
															<EmojiPeopleIcon />
														}
														onClick={event =>
															this.requestClick(
																event,
																res.url,
																res.requested,
																i
															)
														}>
														<Typography
															variant='body2'
															style={{
																fontWeight: 600,
																textTransform:
																	'capitalize'
															}}>
															Pull Request &#183;{' '}
															{
																res.requested
																	.length
															}
														</Typography>
													</Button>
												) : (
													<Button
														variant='text'
														style={{
															color: '#919191'
														}}
														startIcon={
															<EmojiPeopleIcon />
														}
														onClick={event =>
															this.requestClick(
																event,
																res.url,
																res.requested,
																i
															)
														}>
														<Typography
															variant='body2'
															style={{
																fontWeight: 600,
																textTransform:
																	'capitalize'
															}}>
															Request &#183;{' '}
															{
																res.requested
																	.length
															}
														</Typography>
													</Button>
												)}
											</div>
										</div>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'flex-start'
											}}>
											<Typography variant='body1'>
												{res.answer.author_name}
											</Typography>
											<Typography variant='subtitle2'>
												Updated at{' '}
												{new Date(
													res.answer.updated_at
												).toLocaleDateString('en-US', {
													weekday: 'long',
													year: 'numeric',
													month: 'long',
													day: 'numeric'
												})}
											</Typography>
											<Typography
												variant='body1'
												style={{
													marginTop: '2rem'
												}}>
												{res.answer.answer}
											</Typography>
											<div
												style={{
													display: 'flex',
													flexDirection: 'row',
													marginTop: '0.5rem'
												}}>
												{this.checkUserInArray(
													res.answer.upvoters
												) ? (
													<Button
														variant='outlined'
														style={{
															color: '#54e1e3'
														}}
														startIcon={
															<ThumbUpIcon />
														}
														onClick={() =>
															this.upvoteAnswerClick(
																res.answer.id,
																res.answer
																	.upvoters,
																i
															)
														}>
														<Typography
															variant='body2'
															style={{
																fontWeight: 700,
																textTransform:
																	'capitalize'
															}}>
															Remove &#183;{' '}
															{
																res.answer
																	.upvoters
																	.length
															}
														</Typography>
													</Button>
												) : (
													<Button
														variant='outlined'
														style={{
															color: '#919191'
														}}
														startIcon={
															<ThumbUpIcon />
														}
														onClick={() =>
															this.upvoteAnswerClick(
																res.answer.id,
																res.answer
																	.upvoters,
																i
															)
														}>
														<Typography
															variant='body2'
															style={{
																fontWeight: 700,
																textTransform:
																	'capitalize'
															}}>
															Upvote &#183;{' '}
															{
																res.answer
																	.upvoters
																	.length
															}
														</Typography>
													</Button>
												)}
											</div>
										</div>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							))}
						</InfiniteScroll>
					</div>
					<div
						className='hidden'
						style={{
							flex: 1,
							marginTop: '4rem',
							marginLeft: '2rem'
						}}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								position: 'fixed'
							}}>
							<div
								style={{
									padding: '1rem',
									borderStyle: 'solid',
									borderColor: '#bababa',
									borderWidth: '0.05rem'
								}}>
								<Typography
									variant='body1'
									style={{ fontWeight: 600 }}>
									Tips to improve your feed
								</Typography>
							</div>
							<div
								style={{
									padding: '1rem',
									backgroundColor: '#fff',
									borderStyle: 'solid',
									borderColor: '#bababa',
									borderWidth: '0.05rem',
									borderTop: 'none'
								}}>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Visit your feed
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Subscribe to more genres
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Follow more topics
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Answer more questions
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Ask more questions
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ marginBottom: '1rem' }}>
									Upvote more good answers
								</Typography>
							</div>
						</div>
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
								backgroundColor: '#fff',
								width: '50%'
							}}>
							<div
								style={{
									backgroundColor: '#e3e3e3',
									padding: '1rem'
								}}>
								<Typography variant='h6'>
									Add Question
								</Typography>
							</div>

							<div style={{ padding: '1rem' }}>
								<div>
									<Typography
										variant='h6'
										style={{
											fontWeight: 700,
											marginBottom: '0.5rem'
										}}>
										Tips on getting good answers quickly
									</Typography>

									<div style={{ marginTop: '1rem' }}>
										<Typography
											variant='body1'
											style={{ marginTop: '0.5rem' }}>
											Make sure your question hasn't been
											asked already
										</Typography>
										<Typography
											variant='body1'
											style={{ marginTop: '0.5rem' }}>
											Keep your question short and to the
											point
										</Typography>
										<Typography
											variant='body1'
											style={{ marginTop: '0.5rem' }}>
											Double-check grammar and spelling
										</Typography>
									</div>
								</div>

								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'flex-start',
										marginTop: '1.5rem',
										marginBottom: '1.5rem',
										alignItems: 'center'
									}}>
									<Avatar
										src={this.state.user.avatar_url}
										alt={this.state.user.name}
										style={{
											height: '2rem',
											width: '2rem'
										}}
									/>
									<Typography
										variant='body1'
										style={{ marginLeft: '1rem' }}>
										Posting as {this.state.user.name}
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
											style: {
												fontSize: 26,
												fontWeight: 600
											}
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
											this.setState({
												modalVisible: false
											})
										}
										style={{ marginRight: '0.2rem' }}>
										Cancel
									</Button>
									<Button
										color='primary'
										variant='contained'
										onClick={() => this.handleAskQuestion()}
										style={{ marginLeft: '0.2rem' }}>
										Add question
									</Button>
								</div>
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
