import React from 'react';
import Cookies from 'js-cookie';
import serverUrl from '../config';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../utils';
import theme from '../theme';
import { CircularProgress } from '@material-ui/core';


export default class RequestModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            people: [],
            next: null
        }
    }

    getPeople() {
        utils.getAllUsers(this.state.next).then((res) => {
            for (let i = 0; i < res.results.length; i++) this.state.people.push(res.results[i]);
            console.log('Got all users');
            this.setState({ loading: false, error: false, next: res.next });
        }).catch((error) => {
            console.error(error);
            this.setState({ loading: false, error: false });
        });
    }

    componentDidMount() {
        this.getPeople();
    }

    render() {
        if (this.state.loading) return <Backdrop open={this.state.loading} style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress color='secondary' /></Backdrop>
        else if (this.state.error) return <h1>There was an error</h1>
        else return (
            <Modal
                aria-labelledby='modal-question'
                aria-describedby='modal-ask-question'
                open={this.props.requestModal}
                onClose={() => this.setState({ questionModal: false })}
                closeAfterTransition
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}>
                <Fade in={this.props.requestModal}>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            width: '50%'
                        }}>
                        <div
                            style={{
                                backgroundColor: '#e3e3e3',
                                padding: '1rem'
                            }}>
                            <Typography variant='h6'>
                                Request for an answer
                            </Typography>
                        </div>

                        <Typography
                            variant='h6'
                            style={{
                                fontWeight: 700,
                                marginBottom: '0.5rem'
                            }}>
                            Ask people for answers
                        </Typography>

                        <InfiniteScroll
                            dataLength={this.state.people.length}
                            next={() => this.getPeople()}
                            hasMore={this.state.next !== null}
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
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }
                        >

                        </InfiniteScroll>
                    </div>
                </Fade>
            </Modal>
        )
    }
}