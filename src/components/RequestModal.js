import React from 'react';
import Cookies from 'js-cookie';
import serverUrl from '../config';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../utils';
import { CircularProgress, IconButton, Button } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default class RequestModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			people: [],
			count: 0,
			next: null,
			hasMore: true,
			selectedPeople: this.props.requested
		};
	}

	getPeople() {
		utils
			.getAllUsers(this.state.next, this.props.questionUrl)
			.then(res => {
				for (let i = 0; i < res.results.length; i++)
					this.state.people.push(res.results[i]);
				console.log('Got all users');
				console.log(res);
				this.setState({
					loading: false,
					error: false,
					count: res.count,
					next: res.next,
					hasMore: res.next === null ? false : true
				});
				console.log(this.state);
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: false });
			});
	}

	async sendRequests() {
		const token = Cookies.get('TOKEN');

		let rawResponse = await fetch(
			`${serverUrl}/api/questions/${this.props.questionUrl}`,
			{
				method: 'PUT',
				headers: {
					Authorization: `Token ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					requested: this.state.selectedPeople
				})
			}
		);

		let res = await rawResponse.json();
		console.log(rawResponse);
		console.log(res);

		if (rawResponse.status === 200 && res.status === 'success') return res;
		else throw Error('ERR_REQUEST');
	}

	handleRequest() {
		this.sendRequests()
			.then(res => {
				console.log('Sent requests successfully');
				this.props.onSendComplete(false);
			})
			.catch(error => {
				console.error(error);
			});
	}

	componentDidMount() {
		this.getPeople();
		console.log(this.state);
	}

	render() {
		if (this.state.loading)
			return (
				<Backdrop
					open={this.state.loading}
					style={{
						height: '100vh',
						width: '100vw',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}>
					<CircularProgress color='secondary' />
				</Backdrop>
			);
		else if (this.state.error) return <h1>There was an error</h1>;
		else
			return (
				<Modal
					aria-labelledby='modal-question'
					aria-describedby='modal-ask-question'
					open={this.props.requestModal}
					onClose={() => this.setState({ questionModal: false })}
					closeAfterTransition
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center'
					}}
					BackdropComponent={Backdrop}
					BackdropProps={{ timeout: 500 }}
					onBackdropClick={event => this.props.backdropClick(event)}>
					<Fade in={this.props.requestModal}>
						<div
							style={{
								backgroundColor: '#fff',
								width: '50%'
							}}>
							<div
								style={{
									backgroundColor: '#e3e3e3',
									padding: '1rem',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'space-between'
								}}>
								<Typography variant='h6'>
									Request for an answer
								</Typography>
								<Button
									variant='outlined'
									color='secondary'
									style={{
										borderRadius: '2rem',
										textTransform: 'none'
									}}
									onClick={event => this.handleRequest()}>
									Send Requests
								</Button>
							</div>

							<div style={{ padding: '1rem' }}>
								<Typography
									variant='body1'
									style={{
										fontWeight: 600,
										marginBottom: '0.5rem'
									}}>
									Ask people for answers &#183;{' '}
									{this.state.selectedPeople.length}
								</Typography>

								<div
									style={{
										height: '26rem',
										width: '100%',
										overflowY: 'scroll'
									}}
									id='scroll-div'>
									<InfiniteScroll
										dataLength={this.state.people.length}
										next={() => this.getPeople()}
										hasMore={this.state.hasMore}
										scrollableTarget='scroll-div'
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
										{this.state.people.map((person, i) => {
											return (
												<RequestPeopleItem
													key={i}
													name={
														person.profile.full_name
													}
													bio={person.profile.bio}
													userName={person.username}
													addClick={userName => {
														let selectedPeople = this
															.state
															.selectedPeople;
														selectedPeople.push(
															userName
														);
														this.setState({
															selectedPeople
														});
														console.log(
															this.state
																.selectedPeople
														);
													}}
													removeClick={userName => {
														console.log(userName);
														let selectedPeople = this
															.state
															.selectedPeople;
														selectedPeople = utils.removeValueFromArray(
															selectedPeople,
															userName
														);
														this.setState({
															selectedPeople
														});
														console.log(
															this.state
																.selectedPeople
														);
													}}
													selectedPeople={
														this.state
															.selectedPeople
													}
												/>
											);
										})}
									</InfiniteScroll>
								</div>
							</div>
						</div>
					</Fade>
				</Modal>
			);
	}
}

export class RequestPeopleItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: false,
			name: this.props.name,
			bio: this.props.bio,
			userName: this.props.userName
		};
	}

	render() {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					padding: '0.5rem 2rem'
				}}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}>
					<Typography variant='body1' style={{ fontWeight: 600 }}>
						{this.state.name}
					</Typography>
					<Typography variant='caption' color='textSecondary'>
						{this.state.bio}
					</Typography>
				</div>

				{this.state.selected ||
				utils.checkUserInArray(
					this.props.selectedPeople,
					this.state.userName
				) ? (
					<IconButton
						onClick={() => {
							this.props.removeClick(this.state.userName);
							this.setState({ selected: false });
						}}>
						<AddCircleIcon color='primary' />
					</IconButton>
				) : null}
				{!this.state.selected &&
				!utils.checkUserInArray(
					this.props.selectedPeople,
					this.state.userName
				) ? (
					<IconButton
						onClick={() => {
							this.props.addClick(this.state.userName);
							this.setState({ selected: true });
						}}>
						<AddCircleOutlineIcon color='primary' />
					</IconButton>
				) : null}
			</div>
		);
	}
}
