import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Tab from './Tab';
import AskedQuestions from './AskedQuestions';
import Answers from './Answers';
import Comments from './Comments';
import Upvotes from './Upvotes';

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
				<ol className='tab-list'>
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
										questions={child.props.questions}
									/>
								);
							case 'Answers':
								return <Answers />;
							case 'Comments':
								return <Comments />;
							case 'Upvotes':
								return <Upvotes />;
							default:
								return <h1>There was an error.</h1>;
						}
					})}
				</div>
			</div>
		);
	}
}