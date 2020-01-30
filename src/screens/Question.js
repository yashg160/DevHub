import React from 'react';
import Cookies from 'js-cookie';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';

import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import EditIcon from '@material-ui/icons/Edit';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Link from '@material-ui/core/Link';

import serverUrl from '../config';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false,
			question: null
		};
	}

	editAnswerClick(i) {
		// Here i is the index of the question to edit the answer of
		console.log('Clicked editAnswerClick');
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
		console.group(res);

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
				console.group(res);
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

	handleRequestClick() {
		// Method is to be implemented
		console.log('Pressed on follow button');
	}

	handleFollowClick() {
		// Method is to be implemented
		console.log('Pressed on request button');
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;

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
								<Typography variant='h5' style={{ flex: 1 }}>
									Reactora
								</Typography>
								<div style={{ flex: 2 }}>
									<div
										style={{
											display: 'flex',
											flexDirection: 'row'
										}}>
										<Link
											style={{
												color: '#fff',
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
												this.props.history.push(
													'/genres'
												)
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
							marginTop: '2rem'
						}}>
						{this.state.question.question}
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
								<Typography
									variant='body1'
									style={{ fontWeight: 600 }}>
									{answer.author_name}
								</Typography>
								<Typography
									variant='subtitle2'
									style={{ color: '#919191' }}>
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
								<Typography
									variant='body1'
									style={{ marginTop: '2rem' }}>
									{answer.answer}
								</Typography>
								<Button
									disabled={
										!(
											answer.author_name ===
											this.state.user.name
										)
									}
									variant='text'
									style={{
										color: '#919191',
										marginTop: '0.5rem'
									}}
									startIcon={<EditIcon />}
									onClick={() => this.editAnswerClick(i)}>
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
							<hr />
						</div>
					))}
				</Container>
			</div>
		);
	}
}
