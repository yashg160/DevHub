import React from 'react';
import Tabs from './tabs/Tabs';
import './styles/tabs.css';
import serverUrl from '../config';
import Cookies from 'js-cookie';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';

export default class Profile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			error: false,
			user: null
		};
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
		console.log(res);
		if (res.status !== 'success') throw Error('ERR_USER_FETCH');
		return res.data;
	}

	componentDidMount() {
		const token = Cookies.get('TOKEN');
		const userName = this.props.match.params.login;
		console.log(token, userName);

		this.getUser(userName, token)
			.then(res => {
				this.setState({ user: res, loading: false, error: false });
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
		else if (this.state.error) return <h1>There was an error</h1>;
		return (
			<div>
				<Grid container direction='row'>
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
							style={{ height: '16rem', width: '16rem' }}
						/>
						<Typography variant='h5'>
							{this.state.user.name}
						</Typography>
						<Typography variant='h6'>
							{this.state.user.login}
						</Typography>
						<Typography variant='subtitle1'>
							{this.state.user.bio}
						</Typography>
						<Typography variant='subtitle1'>
							{this.state.user.company}
						</Typography>
						<Typography variant='subtitle1'>
							{this.state.user.location}
						</Typography>
					</Grid>
					<Grid item sm={12} md={12} lg={9}></Grid>
				</Grid>
			</div>
		);
	}
}
