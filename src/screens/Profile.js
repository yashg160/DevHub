import React from 'react';
import Tabs from './tabs/Tabs';
import serverUrl from '../config';
import Cookies from 'js-cookie';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import utils from '../utils';
import Navbar from '../components/Navbar';
import CustomSnackbar from '../components/CustomSnackbar';
import MainMenu from '../components/MainMenu';
import QuestionModal from '../components/QuestionModal';
import GenresModal from '../components/GenresModal';

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
			requests: null,
			questionModal: false,
			newQuestion: '',
			newQuestionError: false,
			genresModal: false,
			selectedGenres: [],
			snackbar: false,
			snackbarMess: 'There was some error'
		};

		this.genres = null;
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
					comments: res.written_comments,
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

		utils
			.getGenres()
			.then(res => {
				this.genres = Object.keys(res.data);
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
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

	render() {
		console.log('State:', this.state);
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
		else if (this.state.error) return <h1>There was an error</h1>;
		return (
			<ThemeProvider theme={theme.theme}>
				<div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
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
									userName={this.state.user.login}
									showProfileSnackbar={snackbarMess =>
										this.setState({
											snackbar: true,
											snackbarMess
										})
									}
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
				<CustomSnackbar
					message={this.state.snackbarMess}
					snackbar={this.state.snackbar}
					closeSnackbar={snackbar => this.setState({ snackbar })}
				/>
			</ThemeProvider>
		);
	}
}
