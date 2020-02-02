import React from 'react';
import Tabs from './tabs/Tabs';
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
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import utils from '../utils';

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

		this.genres = [
			'Technology',
			'Religion',
			'Philosophy',
			'Science',
			'Politics',
			'Enterpreneurship',
			'Life',
			'News',
			'Startup',
			'Culture',
			'Business',
			'Facts',
			'Humor',
			'Travel',
			'Innovation',
			'Sports',
			'Health'
		];
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
		if (res.status !== 'success') throw Error('ERR_POST');
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
					snackbar: true
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
							loading: false
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
		if (this.state.selectedGenres.length < 5)
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
												questionModal: false,
												genresModal: true
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
										Select genres to make you question more
										discoverable
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
											label={genre}
											onClick={() => this.genreClick(i)}
											color={
												utils.checkUserInArray(
													this.state.selectedGenres,
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
										onClick={() => this.handleAddQuestion()}
										style={{ marginLeft: '0.2rem' }}>
										Add question
									</Button>
								</div>
							</div>
						</div>
					</Fade>
				</Modal>
				<Snackbar
					anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
					key={'profile-snackbar'}
					open={this.state.snackbar}
					close={() => this.setState({ snackbar: false })}>
					<SnackbarContent
						style={{ backgroundColor: '#41b578', color: '#fff' }}
						message={this.state.snackbarMess}
						action={
							<IconButton
								color='secondary'
								onClick={() =>
									this.setState({ snackbar: false })
								}>
								<CloseIcon />
							</IconButton>
						}
					/>
				</Snackbar>
			</ThemeProvider>
		);
	}
}
