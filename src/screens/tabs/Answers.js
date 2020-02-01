import React from 'react';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';

import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import InfiniteScroll from 'react-infinite-scroll-component';

import serverUrl from '../../config';
import utils from '../../utils';

import Cookies from 'js-cookie';

export default class Answers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			answers: props.answers
		};
		console.log(props);
	}
	render() {
		return (
			<InfiniteScroll
				style={{ marginTop: '1rem' }}
				dataLength={this.state.answers.length}
				next={() => console.log('Fetch more questions')}
				hasMore={false}
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
					<Typography
						variant='body1'
						style={{ textAlign: 'center', marginTop: '1rem' }}>
						That's all! Ask a few more questions.
					</Typography>
				}>
				{this.state.answers.map(answer => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							padding: '1rem',
							border: '0.1rem solid #bababa',
							marginTop: '0.5rem',
							marginBottom: '0.5rem'
						}}>
						<Typography
							variant='h6'
							style={{
								fontWeight: 700,
								textTransform: 'capitalize'
							}}>
							{String(answer.question)
								.split('-')
								.join(' ')}
						</Typography>

						<Typography
							variant='subtitle2'
							style={{ marginTop: '1rem' }}>
							You Answered:
						</Typography>
						<Typography
							variant='body1'
							style={{ marginTop: '0.1rem' }}>
							{answer.answer}
						</Typography>
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								marginTop: '0.5rem',
								color: '#54e1e3',
								verticalAlign: 'center'
							}}>
							<ThumbUpIcon />
							<Typography
								variant='body1'
								style={{
									fontWeight: 600
								}}>
								{' '}
								&#183; {answer.upvoters.length}
							</Typography>
						</div>
					</div>
				))}
			</InfiniteScroll>
		);
	}
}
