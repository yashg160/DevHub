import React from 'react';
import Typography from '@material-ui/core/Typography';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';


export default class UpvotedComments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			upvotedComments: props.upvotedComments
		}
	}

	render() {
		return (
			this.state.upvotedComments.map((comment, i) => (
				<div
					key={i}
					style={{
						display: 'flex',
						flexDirection: 'column',
						padding: '1rem',
						border: '1px solid #eeeeee',
						borderRadius: '4px',
						marginBottom: '1rem'
					}}>

					<Typography
						variant='subtitle2'
						color='textSecondary'>
						{comment.author_name} commented
					</Typography>

					<Typography variant='body1'>
						{comment.comment}
					</Typography>

					<Typography
						variant='subtitle2'
						style={{ marginTop: '0.5rem' }}>
						You upvoted this
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
							{comment.upvotes}
						</Typography>
					</div>

				</div>
			))
		)
	}
}
