import React from 'react';

export default class Question extends React.Component {
	render() {
		return <h1>{this.props.history.location.pathname}</h1>;
	}
}
