import React from 'react';
import Cookies from 'js-cookie';
import RequestModal from '../components/RequestModal';
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
import utils from '../utils';
import Navbar from '../components/Navbar';
import MainMenu from '../components/MainMenu';
import QuestionModal from '../components/QuestionModal';
import GenresModal from '../components/GenresModal';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false,
			menuVisible: null,
			question: null,
			requestModal: false,
			questionModal: false,
			newQuestion: '',
			newQuestionError: false,
			genresModal: false,
			selectedGenres: []
		};

		this.genres = null;
	}

	handleAddQuestion() {
		utils
			.checkQuestion(this.state.newQuestion)
			.then(() => {
				utils.postQuestion(
					this.state.selectedGenres,
					this.genres,
					this.state.newQuestion
				);
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

	async setGenres(res) {
		this.genres = Object.keys(res.data);
	}

	componentDidMount() {
		utils
			.getUser()
			.then(user => this.setState({ user }))
			.then(() => utils.getGenres())
			.then(res => this.setGenres(res))
			.then(() =>
				utils.getQuestionData(this.props.match.params.questionUrl)
			)
			.then(res =>
				this.setState({
					question: res.data,
					loading: false,
					error: false
				})
			)
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
		/* utils
			.getGenres()
			
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
		utils
			.getQuestionData()
			
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			}); */
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;

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
								variant='outlined'
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
							{utils.checkUserInArray(
								this.state.question.followers_list,
								this.state.user.login
							) ? (
								<Button
									variant='text'
									color='primary'
									startIcon={<RssFeedIcon />}
									onClick={event =>
										utils
											.followClick(
												event,
												this.state.question.url,
												this.state.question
													.followers_list,
												this.state.user.login
											)
											.then(status => {
												if (status === 'removed')
													this.state.question.followers_list = utils.removeValueFromArray(
														this.state.question
															.followers_list,
														this.state.user.login
													);
												this.forceUpdate();
											})
											.catch(error =>
												console.error(error)
											)
									}
									style={{ marginRight: '1rem' }}>
									<Typography
										variant='body2'
										style={{
											fontWeight: 500,
											fontSize: 18,
											textTransform: 'capitalize'
										}}>
										Unfollow &#183;{' '}
										{
											this.state.question.followers_list
												.length
										}
									</Typography>
								</Button>
							) : (
								<Button
									variant='text'
									style={{
										color: '#919191',
										marginRight: '1rem'
									}}
									startIcon={<RssFeedIcon />}
									onClick={event =>
										utils
											.followClick(
												event,
												this.state.question.url,
												this.state.question
													.followers_list,
												this.state.user.login
											)
											.then(status => {
												if (status === 'followed')
													this.state.question.followers_list.push(
														this.state.user.login
													);
												this.forceUpdate();
											})
											.catch(error =>
												console.error(error)
											)
									}>
									<Typography
										variant='body2'
										style={{
											fontWeight: 500,
											fontSize: 18,
											textTransform: 'capitalize'
										}}>
										Follow &#183;{' '}
										{
											this.state.question.followers_list
												.length
										}
									</Typography>
								</Button>
							)}

							<Button
								variant='text'
								style={{ color: '#919191' }}
								startIcon={<EmojiPeopleIcon />}
								onClick={() => {
									this.setState({ requestModal: true });
								}}>
								<Typography
									variant='body2'
									style={{
										fontWeight: 500,
										fontSize: 18,
										textTransform: 'capitalize'
									}}>
									Request &#183;{' '}
									{this.state.question.requested.length}
								</Typography>
							</Button>
						</div>

						<Typography
							variant='h6'
							style={{ fontWeight: 500, marginTop: '1rem' }}>
							{this.state.question.all_answers.length} Answers
						</Typography>
						<hr></hr>
						{this.state.question.all_answers.map((answer, i) => {
							var editButton =
								answer.author_name === this.state.user.login;
							return (
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
													).toLocaleDateString(
														'en-US',
														{
															weekday: 'long',
															year: 'numeric',
															month: 'long',
															day: 'numeric'
														}
													)}
												</Typography>
											</div>

											<Button
												variant='text'
												startIcon={<EditIcon />}
												style={{
													display: editButton
														? null
														: 'none'
												}}
												onClick={() =>
													this.editAnswerClick(i)
												}>
												<Typography
													variant='body2'
													style={{
														fontWeight: 600,
														textTransform:
															'capitalize'
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
							);
						})}
					</Container>
				</div>
				<MainMenu
					menuVisible={this.state.menuVisible}
					user={this.state.user}
					history={this.props.history}
					setState={menuVisible => this.setState({ menuVisible })}
				/>

				<QuestionModal
					questionModal={this.state.questionModal}
					user={this.state.user}
					onChange={event =>
						this.setState({ newQuestion: event.target.value })
					}
					newQuestionError={this.state.newQuestionError}
					cancelClick={() => this.setState({ questionModal: false })}
					proceedClick={() =>
						this.setState({
							questionModal: false,
							genresModal: true
						})
					}
				/>

				<GenresModal
					genresModal={this.state.genresModal}
					genres={this.genres}
					selectedGenres={this.state.selectedGenres}
					genreClick={i => this.genreClick(i)}
					cancelClick={() => this.setState({ genresModal: false })}
					handleAddQuestion={() => this.handleAddQuestion()}
				/>
				<RequestModal
					requestModal={this.state.requestModal}
					backdropClick={event =>
						this.setState({ requestModal: false })
					}
					questionUrl={this.state.question.url}
					requested={this.state.question.requested}
					onSendComplete={requestModal =>
						this.setState({ requestModal })
					}
				/>
			</ThemeProvider>
		);
	}
}
