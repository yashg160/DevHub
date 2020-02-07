import React from 'react';
import { Button, Typography } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ReplyIcon from '@material-ui/icons/Reply';


export class UpvoteComment extends React.PureComponent {
    render() {
        return (
            <Button color={this.props.selected ? 'primary' : 'default'} onClick={(event) => this.props.handleClick(event)} style={{ textTransform: 'none' }} startIcon={<ThumbUpIcon />}>
                <Typography variant='caption'>{this.props.selected ? 'Remove' : 'Upvote'}</Typography>
            </Button>
        )
    }
}

export class RemoveUpvoteComment extends React.PureComponent {
    render() {
        return (
            <Button color='primary' onClick={(event) => this.props.handleClick(event)} style={{ textTransform: 'none' }} startIcon={<ThumbDownIcon />}>
                <Typography variant='caption'>Upvote</Typography>
            </Button>
        )
    }
}

export class ReplyComment extends React.PureComponent {
    render() {
        return (
            <Button onClick={(event) => this.props.handleClick(event)} style={{ textTransform: 'none' }} startIcon={<ReplyIcon />}>
                <Typography variant='caption'>Reply</Typography>
            </Button>
        )
    }
}
var Buttons = {
    UpvoteComment,
    ReplyComment,
    RemoveUpvoteComment
}
export default Buttons
/*
exports.UpvoteComment = UpvoteComment;
exports.RemoveUpvoteComment = RemoveUpvoteComment;
exports.ReplyComment = ReplyComment; */