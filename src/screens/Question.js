import React from 'react';
import Cookies from 'js-cookie';

import serverUrl from '../config';
import Backdrop from '@material-ui/core/Backdrop';

export default class Question extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			error: false
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

				this.setState({ loading: false, error: false });
			})
			.catch(error => {
				console.error(error);
				this.setState({ loading: false, error: true });
			});
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;

		console.group(this.props.match.params.questionUrl);
		return <h1>{this.props.match.params.questionUrl}</h1>;
	}
}
