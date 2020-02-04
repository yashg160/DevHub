import React from 'react';
import './styles/dashboard.css';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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

import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';

import InfiniteScroll from 'react-infinite-scroll-component';

import serverUrl from '../config';
import utils from '../utils';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import Cookies from 'js-cookie';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export class Comment extends React.Component {
	render() {
		return (
			<div>
				<Typography variant='body1' style={{ fontWeight: 600 }}>
					{this.props.author}
				</Typography>
				<Typography variant='body2'>{this.props.comment}</Typography>
			</div>
		);
	}
}

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
			questionModal: false,
			genresModal: false,
			menuVisible: null,
			newQuestion: '',
			newQuestionError: false,
			snackbar: false,
			snackbarMess: 'Snackbar messsage',
			selectedGenres: []
		};
		this.genres = null;
	}
	createCommentList(comments, isChild, depth) {
		let items = comments.map((comment, i) => {
			return (
				<div key={i} style={{ marginLeft: isChild ? `${depth * 1}rem` : '0' }}>
					<Comment
						key={comment.answer}
						comment={comment.comment}
						author={comment.author_name}
					/>
					{comment.child_comments &&
						this.createCommentList(comment.child_comments, true, depth + 1)}
				</div>
			);
		});
		return items;
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
		console.log(content);
		if (content.status !== 'success') throw Error();
		return content;
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
				this.setState({ error: false, loading: false });
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
		if (this.state.newQuestion.length < 1) {
			throw Error('ERR_CHECK');
		}
	}

	async postQuestion(token) {
		// In state, selected genres contain the indices for the genre tags. Use these to get the tags from the genre array.
		let genres = [];
		this.state.selectedGenres.map(i => genres.push(this.genres[i]));
		console.log(genres);

		let rawResponse = await fetch(serverUrl + '/api/questions', {
			method: 'POST',
			headers: {
				Authorization: `Token ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: this.state.newQuestion,
				genres: genres
			})
		});

		let res = await rawResponse.json();
		console.log(res);
		/* if (res.status !== 'success') throw Error('ERR_POST'); */
		return res;
	}

	handleAddQuestion() {
		var token = Cookies.get('TOKEN');
		console.log(token);
		this.checkQuestion()
			.then(() => {
				this.postQuestion(token);
				this.setState({ loading: true });
			})
			.then(res => {
				console.log('postQuestion returned');
				this.setState({
					loading: false,
					snackbarMess: 'Question posted successfully',
					snackbar: true,
					questionModal: false,
					genresModal: false,
					selectedGenres: [],
					newQuestion: '',
					newQuestionError: false
				});
			})
			.catch(error => {
				console.error(error.message);
				switch (error.message) {
					case 'ERR_CHECK':
						this.setState({
							snackbarMess: 'Please check the question',
							snackbar: true,
							genresModal: false,
							questionModal: true,
							loading: false,
							newQuestionError: true
						});
						break;
					case 'ERR_POST':
						this.setState({
							snackbarMess: 'Question could not be posted',
							snackbar: true,
							loading: false
						});
						break;
					default:
						this.setState({
							snackbarMess: 'Question could not be posted',
							snackbar: true,
							loading: false
						});
						break;
				}
			});
	}

	genreClick(index) {
		if (utils.checkUserInArray(this.state.selectedGenres, index)) {
			this.setState({
				selectedGenres: utils.removeValueFromArray(
					this.state.selectedGenres,
					index
				)
			});
		} else if (this.state.selectedGenres.length < 5)
			this.setState({
				selectedGenres: [...this.state.selectedGenres, index]
			});
		else
			this.setState({
				snackbarMess: 'Select only 5 genres',
				snackbar: true
			});
		console.log(this.state.selectedGenres);
	}

	componentDidMount() {
		var userName = Cookies.get('USER_NAME');
		var token = Cookies.get('TOKEN');
		console.log(userName);
		console.log(token);
		this.getGenres(token)
			.then(content => {
				let genreObject = content.data;
				var genreArray = Object.keys(genreObject);
				console.log(genreArray);
				this.genres = genreArray;
			})
			.catch(error => console.error(error));

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

	topAnswer(answer, i) {
		if (answer == null) {
			return (
				<div>
					<Typography>No anwers yet</Typography>
				</div>
			);
		}
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start'
				}}>
				<Typography variant='body1'>{answer.author_name}</Typography>
				<Typography variant='subtitle2'>
					Updated at{' '}
					{new Date(answer.updated_at).toLocaleDateString('en-US', {
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
					{answer.answer}
				</Typography>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						marginTop: '0.5rem'
					}}>
					{utils.checkUserInArray(
						answer.upvoters,
						this.state.user.login
					) ? (
							<Button
								variant='outlined'
								style={{
									color: '#54e1e3'
								}}
								startIcon={<ThumbUpIcon />}
								onClick={() => {
									utils
										.upvoteAnswerClick(
											answer.id,
											answer.upvoters,
											this.state.user.login
										)
										.then(status => {
											if (status === 'removed')
												this.state.result[
													i
												].answer.upvoters = utils.removeValueFromArray(
													this.state.result[i].answer
														.upvoters,
													this.state.user.login
												);

											this.forceUpdate();
										})
										.catch(error => console.error(error));
								}}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 700,
										textTransform: 'capitalize'
									}}>
									Remove &#183; {answer.upvoters.length}
								</Typography>
							</Button>
						) : (
							<Button
								variant='outlined'
								style={{
									color: '#919191'
								}}
								startIcon={<ThumbUpIcon />}
								onClick={() => {
									utils
										.upvoteAnswerClick(
											answer.id,
											answer.upvoters,
											this.state.user.login
										)
										.then(status => {
											if (status === 'upvoted')
												this.state.result[
													i
												].answer.upvoters.push(
													this.state.user.login
												);
											console.log(this.state.lt);
											this.forceUpdate();
										})
										.catch(error => console.error(error));
								}}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 700,
										textTransform: 'capitalize'
									}}>
									Upvote &#183; {answer.upvoters.length}
								</Typography>
							</Button>
						)}
				</div>
				{answer.comment_thread ? this.createCommentList(
					answer.comment_thread, false, 1
				) : <Typography variant='body1'>No comments yet</Typography>}
			</div>
		);
	}

	render() {
		if (this.state.loading)
			return <Backdrop color='#fff' open={this.state.loading} />;
		else if (this.state.error) return <h1>There was an error</h1>;

		return (
			<ThemeProvider theme={theme.theme}>
				<div>
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
													questionModal: true
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
									This div will contain some other content
									such as related questions or feed.
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
										<Typography
											variant='body1'
											color='textSecondary'>
											{this.state.user.name}
										</Typography>
									</div>
									<Typography
										variant='h6'
										color='textSecondary'
										onClick={() =>
											this.setState({
												questionModal: true
											})
										}
										className='question-link'
										style={{
											fontWeight: 600,
											marginTop: '.5rem'
										}}>
										What is your question today?
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
															color='textSecondary'
															style={{
																marginRight:
																	'1rem'
															}}>
															&#9679; {g}
														</Typography>
													))}
												</div>
												<Typography
													className='question-link'
													variant='h6'
													style={{
														textTransform:
															'capitalize',
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
														startIcon={
															<CreateIcon />
														}
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

													{utils.checkUserInArray(
														res.followers_list,
														this.state.user.login
													) ? (
															<Button
																variant='text'
																color='primary'
																startIcon={
																	<RssFeedIcon />
																}
																onClick={e =>
																	utils
																		.followClick(
																			e,
																			res.url,
																			res.followers_list,
																			this
																				.state
																				.user
																				.login
																		)
																		.then(
																			status => {
																				console.log(
																					status
																				);
																				if (
																					status ===
																					'removed'
																				) {
																					this.state.result[
																						i
																					].followers_list = utils.removeValueFromArray(
																						this
																							.state
																							.result[
																							i
																						]
																							.followers_list,
																						this
																							.state
																							.user
																							.login
																					);
																				} else {
																					this.state.result[
																						i
																					].followers_list.push(
																						this
																							.state
																							.user
																							.login
																					);
																				}
																				this.forceUpdate();
																			}
																		)
																		.catch(
																			error => {
																				console.error(
																					error
																				);
																			}
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
																	utils
																		.followClick(
																			e,
																			res.url,
																			res.followers_list,
																			this
																				.state
																				.user
																				.login
																		)
																		.then(
																			status => {
																				console.log(
																					status
																				);
																				if (
																					status ===
																					'removed'
																				) {
																					this.state.result[
																						i
																					].followers_list = utils.removeValueFromArray(
																						this
																							.state
																							.result[
																							i
																						]
																							.followers_list,
																						this
																							.state
																							.user
																							.login
																					);
																				} else {
																					this.state.result[
																						i
																					].followers_list.push(
																						this
																							.state
																							.user
																							.login
																					);
																				}
																				this.forceUpdate();
																			}
																		)
																		.catch(
																			error => {
																				console.error(
																					error
																				);
																			}
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

													{utils.checkUserInArray(
														res.requested,
														this.state.user.login
													) ? (
															<Button
																variant='text'
																color='primary'
																startIcon={
																	<EmojiPeopleIcon />
																}
																onClick={(e) => {
																	e.stopPropagation();
																	this.setState({ snackbar: true, snackbarMess: 'Already requested answer' });
																}
																}>
																<Typography
																	variant='body2'
																	style={{
																		fontWeight: 600,
																		textTransform:
																			'capitalize'
																	}}>
																	Request
																&#183;{' '}
																	{
																		res
																			.requested
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
																	utils
																		.requestClick(
																			event,
																			res.url,
																			res.requested,
																			this.state.user.login
																		)
																		.then(
																			status => {
																				if (
																					status ===
																					'success'
																				)
																					this.state.result[
																						i
																					].requested.push(
																						this
																							.state
																							.user
																							.login
																					);
																				this.forceUpdate();
																			}
																		)
																		.catch(
																			error => {
																				console.error(
																					error
																				);
																			}
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
																		res
																			.requested
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
													flexDirection: 'column'
												}}>
												{this.topAnswer(res.answer, i)}
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
								marginTop: '6rem',
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
										borderWidth: '0.05rem',
										backgroundColor: '#eeeeee'
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
										style={{ marginBottom: '0.5rem' }}>
										Visit your feed
									</Typography>
									<Typography
										variant='subtitle2'
										style={{ marginBottom: '0.5rem' }}>
										Subscribe to more genres
									</Typography>
									<Typography
										variant='subtitle2'
										style={{ marginBottom: '0.5rem' }}>
										Follow more topics
									</Typography>
									<Typography
										variant='subtitle2'
										style={{ marginBottom: '0.5rem' }}>
										Answer more questions
									</Typography>
									<Typography
										variant='subtitle2'
										style={{ marginBottom: '0.5rem' }}>
										Ask more questions
									</Typography>
									<Typography variant='subtitle2'>
										Upvote more good answers
									</Typography>
								</div>
							</div>
						</div>
					</Container>

					<Modal
						aria-labelledby='modal-question'
						aria-describedby='modal-ask-question'
						open={this.state.questionModal}
						onClose={() => this.setState({ questionModal: false })}
						closeAfterTransition
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center'
						}}
						BackdropComponent={Backdrop}
						BackdropProps={{ timeout: 500 }}>
						<Fade in={this.state.questionModal}>
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
												Make sure your question hasn't
												been asked already
											</Typography>
											<Typography
												variant='body1'
												style={{ marginTop: '0.5rem' }}>
												Keep your question short and to
												the point
											</Typography>
											<Typography
												variant='body1'
												style={{ marginTop: '0.5rem' }}>
												Double-check grammar and
												spelling
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
													newQuestion:
														event.target.value
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
													questionModal: false
												})
											}
											style={{ marginRight: '0.2rem' }}>
											Cancel
										</Button>
										<Button
											color='primary'
											variant='contained'
											onClick={() =>
												this.setState({
													genresModal: true,
													questionModal: false
												})
											}
											style={{ marginLeft: '0.2rem' }}>
											Proceed
										</Button>
									</div>
								</div>
							</div>
						</Fade>
					</Modal>
					<Modal
						aria-labelledby='modal-genres'
						aria-describedby='modal-add-genres'
						open={this.state.genresModal}
						onClose={() => this.setState({ genresModal: false })}
						closeAfterTransition
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center'
						}}
						BackdropComponent={Backdrop}
						BackdropProps={{ timeout: 500 }}>
						<Fade in={this.state.genresModal}>
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
											Select genres to make you question
											more discoverable
										</Typography>
									</div>

									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											justifyContent: 'center',
											alignItems: 'center',
											marginBottom: '0.5rem'
										}}>
										{this.genres.map((genre, i) => (
											<Chip
												key={i}
												label={genre}
												onClick={() =>
													this.genreClick(i)
												}
												color={
													utils.checkUserInArray(
														this.state
															.selectedGenres,
														i
													)
														? 'secondary'
														: 'primary'
												}
												style={{
													padding: '0.5rem',
													color: '#fff',
													margin: '0.5rem'
												}}
											/>
										))}
									</div>
									<Typography align='center' variant='body1'>
										Select upto 5 genres
									</Typography>
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
													genresModal: false
												})
											}
											style={{ marginRight: '0.2rem' }}>
											Cancel
										</Button>
										<Button
											color='primary'
											variant='contained'
											onClick={() =>
												this.handleAddQuestion()
											}
											style={{ marginLeft: '0.2rem' }}>
											Add question
										</Button>
									</div>
								</div>
							</div>
						</Fade>
					</Modal>
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
							<Typography variant='body2'>
								Logged in as
							</Typography>
							<Typography
								variant='body1'
								style={{ fontWeight: 600 }}>
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
							onClick={() =>
								this.setState({ menuVisible: null })
							}>
							Sign Out
						</MenuItem>
					</Menu>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left'
						}}
						open={this.state.snackbar}
						autoHideDuration={5000}
						onClose={() => this.setState({ snackbar: false })}
						ContentProps={{
							'aria-describedby': 'messsage-snackbar',
							style: { backgroundColor: '#fff' }
						}}
						message={
							<Typography
								variant='body1'
								style={{ color: '#000' }}>
								{this.state.snackbarMess}
							</Typography>
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
									this.setState({ snackbar: false })
								}>
								<CloseIcon />
							</IconButton>
						]}></Snackbar>
				</div>
			</ThemeProvider>
		);
	}
}
