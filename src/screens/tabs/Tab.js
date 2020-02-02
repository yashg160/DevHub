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

		const baseStyle = {
			transition: '0.2s'
		};

		const itemStyle = {
			display: 'inline-block',
			listStyle: 'none',
			marginBottom: '-1px',
			padding: '0.5rem 0.75rem'
		};

		const activeStyle = {
			backgroundColor: '#eeeeee',
			border: 'solid',
			borderColor: '#ccc',
			borderRadius: '0.4rem 0.4rem 0 0',
			borderWidth: '1px 1px 0 1px',
			fontWeight: 600
		};

		return (
			<Typography
				variant='body2'
				style={
					className === 'item'
						? { ...baseStyle, ...itemStyle }
						: { ...baseStyle, ...itemStyle, ...activeStyle }
				}
				onClick={onClick}>
				{label}
			</Typography>
		);
	}
}
