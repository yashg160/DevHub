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

import Dialog from '@material-ui/core/Dialog';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Link from '@material-ui/core/Link';

import serverUrl from '../config';

export default class Answer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: false,
			questionUrl: this.props.match.params.questionUrl,
			question: this.props.history.location.state.question,
			answerValue: ''
		};
	}

	componentDidMount() {
		console.group(this.state);
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
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
					</Container>
				</div>
			);
	}
}
