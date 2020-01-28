import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import serverUrl from '../config';

import Cookies from 'js-cookie';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null,
			loading: true,
			error: false
		};
	}

	componentDidMount() {
		var token = Cookies.get('TOKEN');
		console.log(token);
		this.setState({ loading: false });
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
							borderRadius: '0.5rem'
						}}>
						<Typography variant='body1'>User Name</Typography>
						<Typography variant='h4'>
							What is your question or link?
						</Typography>
					</div>

					<div
						style={{
							width: '100%',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center'
						}}></div>
				</Container>
			</div>
		);
	}
}
