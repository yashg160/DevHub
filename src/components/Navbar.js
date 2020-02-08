import React from 'react';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import '../screens/styles/dashboard.css';

export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user
        }
    }

    render() {
        var { handleAvatarClick, handleAddQuestionClick, showAddQuestion, handleHomeClick } = this.props;
        return (
            <AppBar position='fixed'>
                <Toolbar variant='regular' color='primary'>
                    <Container maxWidth='lg'>
                        <div
                            style={{
                                display: 'flex',
                                flexGrow: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                            <Link
                                href='#'
                                onClick={() => handleHomeClick()}
                                variant='h5'
                                style={{ color: '#fff' }}>
                                DevHub
                            </Link>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                <div
                                    className={'link-div'}
                                    style={{
                                        marginRight: '1rem',
                                        padding: '0.5rem'
                                    }}
                                    onClick={(event) =>
                                        handleAvatarClick(event)
                                    }>
                                    <Avatar
                                        src={this.state.user.avatar_url}
                                        style={{
                                            height: '2.3rem',
                                            width: '2.3rem'
                                        }}>
                                        {this.state.user.name}
                                    </Avatar>
                                </div>
                                {
                                    showAddQuestion ? <Button
                                        variant='contained'
                                        color='secondary'
                                        onClick={() =>
                                            handleAddQuestionClick()
                                        }
                                        style={{
                                            borderRadius: '2rem',
                                            textTransform: 'none'
                                        }}>
                                        <Typography
                                            variant='body2'
                                            style={{
                                                fontWeight: 600
                                            }}>
                                            Add Question
                                    </Typography>
                                    </Button> : null
                                }

                            </div>
                        </div>
                    </Container>
                </Toolbar>
            </AppBar>
        )
    }
}
// Define the props types and their values. 
Navbar.propTypes = {
    showAddQuestion: PropTypes.bool.isRequired,
    handleAvatarClick: PropTypes.func,
    handleAddQuestionClick: PropTypes.func,
    handleHomeClick: PropTypes.func,
    user: PropTypes.object
}

// Screen Name controls whether the add question button is rendered or not. On genres screen, the button is not rendered.