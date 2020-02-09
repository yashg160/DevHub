import React from 'react';
import './styles/dashboard.css';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import RequestModal from '../components/RequestModal';
import Button from '@material-ui/core/Button';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CustomSnackbar from '../components/CustomSnackbar';
import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import Navbar from '../components/Navbar';
import Comment from '../components/Comment';
import MainMenu from '../components/MainMenu';
import QuestionModal from '../components/QuestionModal';
import InfiniteScroll from 'react-infinite-scroll-component';

import serverUrl from '../config';
import utils from '../utils';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import Cookies from 'js-cookie';
import { Link } from '@material-ui/core';

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
			requestModal: false,
			menuVisible: null,
			newQuestion: '',
			newQuestionError: false,
			snackbar: false,
			snackbarMess: 'Snackbar messsage',
			selectedGenres: [],
			postingComment: false,
			comment: '',
			currentQuestion: 0
		};
		this.genres = null;
		this.currentAnswer = null;
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
		let url = serverUrl + '/api/home';
		console.log(userName);
		console.log(token);
		utils
			.getGenres()
			.then(res => {
				this.genres = Object.keys(res.data);
			})
			.catch(error => console.error(error));

		utils
			.getUser()
			.then(user => {
				console.log(user);
				this.setState({ user });
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: true, loading: false });
			});

		this.getResults(token, url)
			.then(res => {
				console.log(res);
				res.results.map(r => this.state.result.push(r));

				//Check if "next" url exists in response. If it exists, then set hasMore in state to true.
				//Also store the next url to make future requests for the infinite scrolling
				if (res.next) this.setState({ hasMore: true, next: res.next });
				else this.setState({ hasMore: false, next: null });

				this.setState({ loading: false, error: false });
				console.log(localStorage.getItem('UPVOTED_COMMENTS'));
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: true, loading: false });
			});
	}

	handleCommentClick(event, i) {
		console.log(event, i);
		event.stopPropagation();
		this.setState({ postingComment: true });
		utils
			.postComment(
				this.state.comment,
				this.state.result[i].answer.id,
				null
			)
			.then(status => {
				if (status === 'success')
					this.setState({
						snackbarMess: 'Comment posted successfully',
						snackbar: true,
						postingComment: false,
						comment: ''
					});
				else
					this.setState({
						snackbarMess: 'Failed to post comment',
						snackbar: true,
						postingComment: false
					});
			})
			.catch(error => {
				console.error(error);
				this.setState({
					snackbarMess: 'Failed to post comment',
					snackbar: true,
					postingComment: false
				});
			});
	}

	createCommentList(comments, parentId = null, isChild, depth, i) {
		if (i !== this.currentAnswer && !isChild) depth = 0;
		let items = comments.map((comment, i) => {
			return (
				<div
					key={i}
					style={{ marginLeft: isChild ? `${depth * 2}rem` : '0' }}>
					<Comment
						key={comment.answer}
						comment={comment.comment}
						author={comment.author_name}
						date={comment.created_at}
						isChild
						parentComment={parentId}
						answerIndex={i}
						depth={depth}
						commentId={comment.id}
					/>
					{comment.child_comments.length > 0
						? this.createCommentList(
								comment.child_comments,
								comment.id,
								true,
								depth + 1
						  )
						: null}
				</div>
			);
		});
		return items;
	}

	topAnswer(answer, i) {
		if (answer == null) {
			return (
				<div>
					<Typography>No anwers yet</Typography>
				</div>
			);
		}
		var finalAnswer = {
			time: new Date().getTime(),
			blocks: [
				{
					type: 'paragraph',
					data: {
						text: `${answer.answer}`,
						level: 2
					}
				}
			],
			version: '2.12.4'
		};
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start'
				}}>
				<Typography variant='body1'>{answer.author_name}</Typography>
				<Typography variant='subtitle2' color='textSecondary'>
					Updated at{' '}
					{new Date(answer.updated_at).toLocaleDateString('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</Typography>
				<div>
					{finalAnswer.blocks.length > 1 ? (
						<div style={{ marginTop: '0.5rem' }}>
							<Typography variant='body1'>
								{String(finalAnswer.blocks[0].data.text).substr(
									0,
									200
								) + '...'}
							</Typography>
							<Link
								href='#'
								color='primary'
								variant='body1'
								onClick={() =>
									this.props.history.push({
										pathname: `/questions/${answer.question}`
									})
								}>
								Read More
							</Link>
						</div>
					) : (
						<Typography
							variant='body1'
							style={{ marginTop: '0.5rem' }}>
							{String(finalAnswer.blocks[0].data.text)}
						</Typography>
					)}
				</div>
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
							color='primary'
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
				<div style={{ marginTop: '2rem' }}>
					{answer.comment_thread.length > 0 ? (
						<Typography
							variant='h6'
							style={{ marginBottom: '0.2rem' }}>
							All comments
						</Typography>
					) : (
						<Typography variant='body1'>No comments yet</Typography>
					)}
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}>
						<Avatar
							src={this.state.user.avatar_url}
							alt={this.state.user.name}
						/>
						<TextField
							variant='standard'
							placeholder='Leave your thoughts here...'
							style={{ width: '90%' }}
							multiline
							onChange={event =>
								this.setState({ comment: event.target.value })
							}
							value={this.state.comment}
						/>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'flex-end'
						}}>
						<Button
							variant='text'
							disabled={this.state.postingComment}
							style={{
								textTransform: 'none',
								marginRight: '0.5rem'
							}}
							onClick={event => {
								event.stopPropagation();
								this.setState({ comment: '' });
							}}>
							Cancel
						</Button>
						<Button
							variant='contained'
							disabled={this.state.postingComment}
							color='primary'
							style={{
								color: '#fff',
								textTransform: 'none',
								marginLeft: '0.5rem'
							}}
							onClick={event =>
								this.handleCommentClick(event, i)
							}>
							Comment
						</Button>
					</div>

					{answer.comment_thread.length > 0 ? (
						<div>
							{this.createCommentList(
								answer.comment_thread,
								false,
								0,
								i
							)}
						</div>
					) : null}
				</div>
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
					<Navbar
						handleHomeClick={() =>
							this.props.history.push('/dashboard')
						}
						showAddQuestion={true}
						handleAvatarClick={event =>
							this.setState({ menuVisible: event.currentTarget })
						}
						handleAddQuestionClick={() =>
							this.setState({ questionModal: true })
						}
						user={this.state.user}
					/>
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

													<Button
														variant='text'
														style={{
															color: '#919191'
														}}
														startIcon={
															<EmojiPeopleIcon />
														}
														onClick={e => {
															e.stopPropagation();
															this.setState({
																currentQuestion: i,
																requestModal: true
															});
														}}>
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
												</div>
											</div>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails>
											<div
												style={{
													display: 'flex',
													flexDirection: 'column'
												}}>
												<div
													style={{ display: 'none' }}>
													{(this.currentAnswer = i)}
												</div>

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

					<QuestionModal
						questionModal={this.state.questionModal}
						user={this.state.user}
						onChange={event =>
							this.setState({ newQuestion: event.target.value })
						}
						newQuestionError={this.state.newQuestionError}
						cancelClick={() =>
							this.setState({ questionModal: false })
						}
						proceedClick={() =>
							this.setState({
								questionModal: false,
								genresModal: true
							})
						}
					/>
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
											style={{
												marginRight: '0.2rem',
												textTransform: 'none'
											}}>
											Cancel
										</Button>
										<Button
											color='primary'
											variant='contained'
											onClick={() =>
												this.handleAddQuestion()
											}
											style={{
												marginLeft: '0.2rem',
												textTransform: 'none',
												color: '#fff'
											}}>
											Add question
										</Button>
									</div>
								</div>
							</div>
						</Fade>
					</Modal>

					<MainMenu
						menuVisible={this.state.menuVisible}
						user={this.state.user}
						history={this.props.history}
						setState={menuVisible => this.setState({ menuVisible })}
					/>
					<CustomSnackbar
						message={this.state.snackbarMess}
						snackbar={this.state.snackbar}
						closeSnackbar={snackbar => this.setState({ snackbar })}
					/>
					<RequestModal
						requestModal={this.state.requestModal}
						backdropClick={event =>
							this.setState({ requestModal: false })
						}
						questionUrl={
							this.state.result[this.state.currentQuestion].url
						}
						requested={
							this.state.result[this.state.currentQuestion]
								.requested
						}
						onSendComplete={requestModal =>
							this.setState({ requestModal })
						}
					/>
				</div>
			</ThemeProvider>
		);
	}
}
