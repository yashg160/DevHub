import React from 'react';
import Typography from '@material-ui/core/Typography';
import Buttons from './Buttons';
import utils from '../utils';

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answerIndex: this.props.answerIndex,
            depth: this.props.depth,
            commentId: this.props.commentId,
            parentId: this.props.parentId,
            upvoted: false
        }
    }

    componentDidMount() {
        var upvotedComments = JSON.parse(localStorage.getItem('UPVOTED_COMMENTS'));

        if (upvotedComments && upvotedComments.length > 0)
            if (utils.checkUserInArray(upvotedComments, this.state.commentId)) this.setState({ upvoted: true });
    }

    handleClick(event) {
        event.stopPropagation();
        var upvote, removeUpvote;
        if (this.state.upvoted) {
            upvote = false;
            removeUpvote = true;
        }
        else {
            upvote = true;
            removeUpvote = false;
        }
        utils.updateComment(this.props.comment, upvote, removeUpvote, this.state.commentId)
            .then((status) => {
                if (status === 'success') {
                    var upvotedComments = JSON.parse(localStorage.getItem('UPVOTED_COMMENTS'));
                    if (upvote) {
                        console.log('Voted comment');
                        upvotedComments.push(this.state.commentId);
                        this.setState({ upvoted: true });
                    }
                    else if (removeUpvote) {
                        console.log('Removed Upvote');
                        utils.removeValueFromArray(upvotedComments, this.state.commentId);
                        this.setState({ upvoted: false });
                    }
                    localStorage.setItem('UPVOTED_COMMENTS', JSON.stringify(upvotedComments));
                }
                else throw Error();
            }).catch((error) => {
                console.error(error);
            });
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
                    <Buttons.UpvoteComment handleClick={event => this.handleClick(event)} selected={this.state.upvoted} />
                    <Buttons.ReplyComment />
                </div>
            </div>
        );
    }
}