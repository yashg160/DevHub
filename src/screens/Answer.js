import React from 'react';
import Cookies from 'js-cookie';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import serverUrl from '../config';
import Navbar from '../components/Navbar';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import utils from '../utils';
import Editor from '@stfy/react-editor.js';
import LinkTool from '@editorjs/link';
import InlineCode from '@editorjs/inline-code';
import MainMenu from '../components/MainMenu';

export default class Answer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: null,
			error: false,
			toQuestion: false,
			questionUrl: this.props.match.params.questionUrl,
			question: null,
			editAnswer: false,
			answerId: null,
			answerValue: null,
			menuVisible: null
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
					this.setState({
						loading: false,
						error: false,
						toQuestion: true
					});
				})
				.catch(error => {
					console.log(error);
					this.setState({
						loading: false,
						error: true,
						toQuestion: false
					});
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
							answerValue = JSON.parse(
								res.data.all_answers[i].answer
							);
							break;
						}
					}
				}
				this.setState({
					question: res.data,
					answerValue: answerValue === null ? {} : answerValue,
					editAnswer: this.props.location.state.editAnswer,
					answerId: this.props.location.state.answerId
				});
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: true, loading: false });
			});

		utils
			.getUser()
			.then(user => {
				console.log(user);
				this.setState({ user, loading: false, error: false });
			})
			.catch(error => console.error(error));
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
		else if (this.state.error) return <h1>There was an error</h1>;
		else
			return (
				<ThemeProvider theme={theme.theme}>
					<Navbar
						handleHomeClick={() =>
							this.props.history.push('/dashboard')
						}
						showAddQuestion={false}
						handleAvatarClick={event =>
							this.setState({ menuVisible: event.currentTarget })
						}
						handleAddQuestionClick={() =>
							console.log('Add question button pressed')
						}
						user={this.state.user}
					/>

					<Container
						maxWidth='md'
						style={{
							marginTop: '6rem',
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
								marginTop: '0.5rem'
							}}>
							{this.state.question.question}
						</Typography>
						<Typography
							variant='h6'
							style={{ fontWeight: 500, marginTop: '1rem' }}>
							Write an answer
						</Typography>
						<div
							style={{
								border: '1px solid #eeeeee',
								borderRadius: '8px'
							}}>
							<Editor
								autofocus
								data={this.state.answerValue}
								onData={data =>
									this.setState({
										answerValue: JSON.stringify(data)
									})
								}
								onReady={() => console.log('Ready to type!!')}
								onChange={() =>
									console.log(this.state.answerValue)
								}
								tools={{
									inlineCode: {
										class: InlineCode
									},
									link: LinkTool
								}}
							/>
						</div>

						<Button
							variant='contained'
							color='primary'
							endIcon={<SendIcon />}
							onClick={() => this.handleSubmitPress()}
							style={{ marginTop: '1rem', color: '#fff' }}>
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
					<MainMenu
						menuVisible={this.state.menuVisible}
						user={this.state.user}
						history={this.props.history}
						setState={menuVisible => this.setState({ menuVisible })}
					/>
				</ThemeProvider>
			);
	}
}
