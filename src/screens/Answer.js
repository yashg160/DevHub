import React from 'react';
import Cookies from 'js-cookie';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';

import SendIcon from '@material-ui/icons/Send';
import { Redirect } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import Link from '@material-ui/core/Link';

import serverUrl from '../config';

export default class Answer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			toQuestion: false,
			questionUrl: this.props.match.params.questionUrl,
			question: null,
			editAnswer: false,
			answerId: null,
			answerValue: ''
		};
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

	async checkAnswer() {
		if (this.state.answerValue.length === 0) throw Error('ERR_ANSWER');
	}

	async postAnswer(token) {
		const questionUrl = this.state.questionUrl;

		let rawResponse = await fetch(serverUrl + '/api/answers', {
			method: 'POST',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				question: questionUrl,
				answer: this.state.answerValue
			})
		});

		let res = await rawResponse.json();

		if (res.status !== 'success') throw Error('ERR_SERVER');
		return res;
	}

	async putAnswer(token) {
		let rawResponse = await fetch(
			serverUrl + `/api/answers/${this.state.answerId}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					answer: this.state.answerValue
				})
			}
		);

		let res = await rawResponse.json();
		console.log(res);
		if (res.status !== 'success') throw Error('ERR_PUT_ANSWER');
		return res;
	}

	handleSubmitPress() {
		const token = Cookies.get('TOKEN');
		console.log(token);

		if (this.state.editAnswer) {
			this.checkAnswer()
				.then(() => this.putAnswer(token))
				.then(res => {
					console.log(res);
				})
				.catch(error => {
					console.log(error);
				});
		} else {
			this.checkAnswer()
				.then(() => this.postAnswer(token))
				.then(res => {
					console.log(res);
					this.setState({
						loading: false,
						error: false,
						toQuestion: true
					});
				})
				.catch(error => {
					console.error(error);
					this.setState({
						loading: false,
						error: true,
						toQuestion: false
					});
				});
		}
	}

	componentDidMount() {
		const token = Cookies.get('TOKEN');

		this.getQuestionData(token, this.state.questionUrl)
			.then(res => {
				console.log(res);
				let answerValue = null;

				if (this.props.location.state.editAnswer) {
					for (let i = 0; i < res.data.all_answers.length; i++) {
						if (
							res.data.all_answers[i].id ===
							this.props.location.state.answerId
						) {
							answerValue = res.data.all_answers[i].answer;
							break;
						}
					}
				}
				this.setState({
					loading: false,
					error: false,
					question: res.data,
					answerValue: answerValue === null ? '' : answerValue,
					editAnswer: this.props.location.state.editAnswer,
					answerId: this.props.location.state.answerId
				});
				console.log(this.props);
				console.log(this.state);
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: true, loading: false });
			});
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
		else if (this.state.toQuestion)
			return (
				<Redirect
					to={{ pathname: `/questions/${this.state.questionUrl}` }}
				/>
			);
		else
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
									<Typography
										variant='h5'
										style={{ flex: 1 }}>
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
							paddingTop: '2rem',
							paddingBottom: '2rem',
							height: `${window.innerHeight}px`
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
						<Typography
							variant='h6'
							style={{ fontWeight: 500, marginTop: '1rem' }}>
							Write an answer
						</Typography>
						<TextField
							id='answer-field'
							multiline
							fullWidth
							InputProps={{
								style: {
									marginTop: '1rem',
									fontWeight: 500,
									fontSize: 20
								}
							}}
							value={this.state.answerValue}
							onChange={event =>
								this.setState({
									answerValue: event.target.value
								})
							}
							variant='filled'
						/>
						<Button
							variant='contained'
							color='primary'
							endIcon={<SendIcon />}
							onClick={() => this.handleSubmitPress()}
							style={{ marginTop: '1rem' }}>
							<Typography
								variant='body1'
								style={{
									fontWeight: 500,
									fontSize: 18,
									textTransform: 'capitalize'
								}}>
								Submit
							</Typography>
						</Button>
					</Container>
				</div>
			);
	}
}
