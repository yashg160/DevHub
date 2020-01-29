import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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

	componentDidMount() {
		this.fetchResult();
	}
	render() {
		if (this.state.loading)
			return <Backdrop color='#fff' open={this.state.loading} />;
		else if (this.state.error) return <h1>There was an error</h1>;

		return (
			<div style={{ backgroundColor: '#e3e3e3' }}>
				<AppBar position='static'>
					<Toolbar>
						<Typography variant='h6'>Reactora</Typography>
					</Toolbar>
				</AppBar>
				<Container
					maxWidth='md'
					style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
							justifyContent: 'center'
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
										marginTop: '1rem',
										marginBottom: '1rem'
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
											<Typography
												variant='h6'
												style={{
													textTransform: 'capitalize',
													fontWeight: 700
												}}>
												{res.question}
											</Typography>
										</div>
										{/* 
										
                                        <Typography>
											{res.answer.answer}
										</Typography>*/}
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
