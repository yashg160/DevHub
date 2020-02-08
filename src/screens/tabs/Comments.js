import React from 'react';
import Typography from '@material-ui/core/Typography';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';


export default class Comments extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: props.comments
		}
	}
	render() {
		return (
			this.state.comments.map((comment, i) => (
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
						You Commented
					</Typography>
					<Typography variant='body1'>
						{comment.comment}
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
		);
	}
}
