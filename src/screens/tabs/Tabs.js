import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';
import AskedQuestions from './AskedQuestions';
import Answers from './Answers';
import Comments from './Comments';
import UpvotedAnswers from './UpvotedAnswers';
import UpvotedComments from './UpvotedComments';
import Requests from './Requests';

export default class Tabs extends Component {
	static propTypes = {
		children: PropTypes.instanceOf(Array).isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			activeTab: this.props.children[0].props.label
		};
	}

	onClickTabItem = tab => {
		this.setState({ activeTab: tab });
	};

	render() {
		const {
			onClickTabItem,
			props: { children },
			state: { activeTab }
		} = this;

		return (
			<div className='tabs'>
				<ol style={{ borderBottom: '1px solid #ccc', paddingLeft: 0 }}>
					{children.map(child => {
						const { label } = child.props;

						return (
							<Tab
								activeTab={activeTab}
								key={label}
								label={label}
								onClick={onClickTabItem}
							/>
						);
					})}
				</ol>
				<div className='tab-content'>
					{children.map(child => {
						if (child.props.label !== activeTab) return undefined;
						switch (child.props.label) {
							case 'Asked Questions':
								return (
									<AskedQuestions
										key={child.props.label}
										questions={child.props.questions}
										history={child.props.history}
									/>
								);
							case 'Answers':
								return (
									<Answers
										key={child.props.label}
										answers={child.props.answers}
										history={child.props.history}
									/>
								);
							case 'Comments':
								return (
									<Comments
										key={child.props.label}
										comments={child.props.comments}
										history={child.props.history}
									/>
								);
							case 'Upvoted Answers':
								return (
									<UpvotedAnswers
										key={child.props.label}
										upvotedAnswers={
											child.props.upvotedAnswers
										}
										history={child.props.history}
									/>
								);
							case 'Upvoted Comments':
								return (
									<UpvotedComments
										key={child.props.label}
										upvotedComments={
											child.props.upvotedComments
										}
										history={child.props.history}
									/>
								);
							case 'Requests':
								return (
									<Requests
										key={child.props.label}
										requests={child.props.requests}
										history={child.props.history}
									/>
								);
							default:
								return <h1>There was an error.</h1>;
						}
					})}
				</div>
			</div>
		);
	}
}
