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
			loading: true,
			error: false,
			question: null
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

	componentDidMount() {
		var token = Cookies.get('TOKEN');
		console.log(token);

		var questionUrl = this.props.match.params.questionUrl;
		console.log(questionUrl);

		this.getQuestionData(token, questionUrl)
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
						paddingTop: '2rem',
						paddingBottom: '2rem'
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

					<Button
						variant='contained'
						color='primary'
						startIcon={<CreateIcon />}
						onClick={() => this.setState({ modalVisible: true })}
						style={{ marginTop: '0.5rem' }}>
						<Typography
							variant='body1'
							style={{
								fontWeight: 500,
								fontSize: 18,
								textTransform: 'capitalize'
							}}>
							Answer
						</Typography>
					</Button>

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
									flexDirection: 'column'
								}}>
								<Typography variant='body1'>
									{answer.author_name}
								</Typography>
								<Typography variant='subtitle2'>
									Updated{' '}
									{new Date(answer.updated_at).toString()}
								</Typography>
								<Typography
									variant='body1'
									style={{ marginTop: '2rem' }}>
									{answer.answer}
								</Typography>
							</div>
							<hr />
						</div>
					))}
				</Container>
			</div>
		);
	}
}
