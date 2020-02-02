import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import RssFeedIcon from '@material-ui/icons/RssFeed';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../../utils';

export default class AskedQuestions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: props.questions
		};
		console.log(props);
	}

	componentDidMount() {}
	render() {
		return (
			<div>
				<InfiniteScroll
					style={{ marginTop: '1rem' }}
					dataLength={this.state.questions.length}
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
					{this.state.questions.map((res, i) => (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								border: '1px solid #eeeeee',
								borderRadius: '4px',
								padding: '1rem',
								marginBottom: '1rem'
							}}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
									marginTop: '0.3rem',
									marginBottom: '1rem'
								}}>
								{res.genres.map((g, i) => (
									<Typography
										key={i}
										variant='body2'
										style={{
											marginRight: '1rem',
											color: '#a3a3a3'
										}}>
										&#9679; {g}
									</Typography>
								))}
							</div>
							<Link
								href='#'
								color='textPrimary'
								variant='h6'
								onClick={() =>
									this.props.history.push(
										`/questions/${res.url}`
									)
								}
								style={{
									fontWeight: 700,
									textTransform: 'capitalize'
								}}>
								{res.question}
							</Link>

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									marginTop: '1rem'
								}}>
								<Button
									variant='text'
									style={{
										color: '#919191'
									}}
									startIcon={<CreateIcon />}
									onClick={event => {
										event.stopPropagation();
										this.props.history.push({
											pathname: `questions/${res.url}/answer`,
											state: {
												question: res
											}
										});
									}}>
									<Typography
										variant='body2'
										style={{
											fontWeight: 600,
											textTransform: 'capitalize'
										}}>
										Answer
									</Typography>
								</Button>

								{utils.checkUserInArray(res.followers_list) ? (
									<Button
										variant='text'
										style={{
											color: '#54e1e3'
										}}
										startIcon={<RssFeedIcon />}
										onClick={e =>
											this.followClick(
												e,
												res.url,
												res.followers_list,
												i
											)
										}>
										<Typography
											variant='body2'
											style={{
												fontWeight: 600,
												textTransform: 'capitalize'
											}}>
											Unfollow &#183;{' '}
											{res.followers_list.length}
										</Typography>
									</Button>
								) : (
									<Button
										variant='text'
										style={{
											color: '#919191'
										}}
										startIcon={<RssFeedIcon />}
										onClick={e =>
											this.followClick(
												e,
												res.url,
												res.followers_list,
												i
											)
										}>
										<Typography
											variant='body2'
											style={{
												fontWeight: 600,
												textTransform: 'capitalize'
											}}>
											Follow &#183;{' '}
											{res.followers_list.length}
										</Typography>
									</Button>
								)}
								{utils.checkUserInArray(res.requested) ? (
									<Button
										variant='text'
										style={{
											color: '#54e1e3'
										}}
										startIcon={<EmojiPeopleIcon />}
										onClick={event =>
											this.requestClick(
												event,
												res.url,
												res.requested,
												i
											)
										}>
										<Typography
											variant='body2'
											style={{
												fontWeight: 600,
												textTransform: 'capitalize'
											}}>
											Pull Request &#183;{' '}
											{res.requested.length}
										</Typography>
									</Button>
								) : (
									<Button
										variant='text'
										style={{
											color: '#919191'
										}}
										startIcon={<EmojiPeopleIcon />}
										onClick={event =>
											this.requestClick(
												event,
												res.url,
												res.requested,
												i
											)
										}>
										<Typography
											variant='body2'
											style={{
												fontWeight: 600,
												textTransform: 'capitalize'
											}}>
											Request &#183;{' '}
											{res.requested.length}
										</Typography>
									</Button>
								)}
							</div>
							<Typography
								variant='body1'
								style={{
									fontWeight: '600',
									marginTop: '0.2rem'
								}}>
								{res.all_answers.length} Answers
							</Typography>
						</div>
					))}
				</InfiniteScroll>
			</div>
		);
	}
}
