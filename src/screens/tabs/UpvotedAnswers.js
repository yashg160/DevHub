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
							border: '1px solid #eeeeee',
							borderRadius: '4px',
							padding: '1rem',
							marginBottom: '1rem'
						}}>
						<Link
							href='#'
							onClick={() =>
								this.props.history.push(
									`/questions/${answer.question}`
								)
							}
							color='textPrimary'
							variant='h6'
							style={{
								fontWeight: 500,
								textTransform: 'capitalize'
							}}>
							{String(answer.question)
								.split('-')
								.join(' ')}
						</Link>
						<Typography variant='body1' style={{ fontWeight: 500 }}>
							{String(answer.answer).length > 250
								? String(answer.answer).substr(0, 250) + '...'
								: String(answer.answer)}
							{String(answer.answer).length > 250 ? (
								<Link
									href='#'
									color='primary'
									onClick={() =>
										this.props.history.push(
											`/questions/${answer.question}`
										)
									}>
									Read More
								</Link>
							) : null}
						</Typography>

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
