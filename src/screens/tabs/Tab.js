import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default class Tab extends Component {
	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired
	};

	onClick = () => {
		const { label, onClick } = this.props;
		onClick(label);
	};

	render() {
		const {
			onClick,
			props: { activeTab, label }
		} = this;

		let className = 'item';

		if (activeTab === label) {
			className = 'active';
		}

		const itemStyle = {
			display: 'inline-block',
			listStyle: 'none',
			marginBottom: '-1px',
			padding: '0.5rem 0.75rem'
		};

		const activeStyle = {
			backgroundColor: '#fff',
			border: 'solid',
			borderWidth: '1px 1px 0 1px',
			fontWeight: 600
		};

		return (
			<Typography
				variant='body2'
				style={
					className === 'item'
						? itemStyle
						: { ...itemStyle, ...activeStyle }
				}
				onClick={onClick}>
				{label}
			</Typography>
		);
	}
}
