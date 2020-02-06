import React from 'react';
import Typography from '@material-ui/core/Typography';
import Buttons from './Buttons';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerIndex: this.props.answerIndex,
            depth: this.props.depth
        }
    }
    render() {
        return (
            <div style={{ marginBottom: this.props.isChild ? '0.1rem' : '0.4rem' }}>
                <Typography variant='body2' style={{ fontWeight: 600 }}>
                    {this.props.author}
                </Typography>
                <Typography variant='subtitle2' color='textSecondary'>
                    {new Date(this.props.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Typography>
                <Typography variant='subtitle2' style={{ marginTop: '0.1rem' }}>{this.props.comment}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', width: '25%', justifyContent: 'space-between', textTransform: 'capitalize' }}>
                    <Buttons.UpvoteComment />
                    <Buttons.ReplyComment />
                </div>
            </div>
        );
    }
}