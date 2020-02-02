import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import InfiniteScroll from 'react-infinite-scroll-component';
import serverUrl from '../../config';
import utils from '../../utils';
import theme from '../../theme';
import { ThemeProvider } from '@material-ui/core/styles';

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
			<ThemeProvider theme={theme.theme}>
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
								border: '1px solid #eeeeee',
								borderRadius: '4px',
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

							<Typography
								variant='subtitle2'
								color='textSecondary'
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
									alignItems: 'center',
									marginTop: '0.5rem',
									verticalAlign: 'center'
								}}>
								<ThumbUpIcon color='primary' />
								<Typography
									variant='body1'
									color='primary'
									style={{
										marginLeft: '4px',
										marginRight: '4px'
									}}>
									&#183;
								</Typography>
								<Typography
									variant='body1'
									color='primary'
									style={{
										fontWeight: 600,
										marginTop: '4px'
									}}>
									{answer.upvoters.length}
								</Typography>
							</div>
						</div>
					))}
				</InfiniteScroll>
			</ThemeProvider>
		);
	}
}
