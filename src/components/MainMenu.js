import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

export default class MainMenu extends React.Component {
	render() {
		return (
			<Menu
				id='main-menu'
				anchorEl={this.props.menuVisible}
				open={Boolean(this.props.menuVisible)}
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
						this.props.setState(null);
						this.props.history.push(
							`/users/${this.props.user.login}`
						);
					}}>
					<Avatar
						src={this.props.user.avatar_url}
						alt={this.props.user.name}
						style={{
							height: '3rem',
							width: '3rem',
							marginBottom: '0.5rem'
						}}
					/>
					<Typography variant='body2'>Logged in as</Typography>
					<Typography variant='body1' style={{ fontWeight: 600 }}>
						{this.props.user.name}
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
						this.props.setState(null);
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
						this.props.setState(null);
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
						this.props.setState(null);
						this.props.history.push(
							`/users/${this.props.user.login}`
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
					onClick={() => this.props.setState(null)}>
					Sign Out
				</MenuItem>
			</Menu>
		);
	}
}
