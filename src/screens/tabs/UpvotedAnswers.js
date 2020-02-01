import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';

export default class UpvotedAnswers extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			upvotedAnswers: props.upvotedAnswers
		};
		console.log(this.state);
	}
	render() {
		return (
			<InfiniteScroll
				style={{ marginTop: '1rem' }}
				dataLength={this.state.upvotedAnswers.length}
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
						That's it folks!!
					</Typography>
				}>
				{this.state.upvotedAnswers.map(answer => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							border: '0.05rem solid #bababa',
							padding: '1rem'
						}}>
						<Typography variant='body1' style={{ fontWeight: 500 }}>
							{String(answer.answer).length > 250
								? String(answer.answer).substr(0, 250) + '...'
								: String(answer.answer)}
						</Typography>
						<Link
							onClick={() =>
								this.props.history.push(
									`/questions/${answer.question}`
								)
							}>
							<Typography variant='subtitle2'>
								View Full Answer
							</Typography>
						</Link>

						<Typography
							variant='body2'
							style={{ marginTop: '0.5rem' }}>
							You upvoted this
						</Typography>
					</div>
				))}
			</InfiniteScroll>
		);
	}
}
