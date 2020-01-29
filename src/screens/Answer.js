import React from 'react';
import Cookies from 'js-cookie';

import Backdrop from '@material-ui/core/Backdrop';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import Typography from '@material-ui/core/Typography';

import CreateIcon from '@material-ui/icons/Create';

import Dialog from '@material-ui/core/Dialog';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Link from '@material-ui/core/Link';

import serverUrl from '../config';

export default class Answer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false
		};
	}

	render() {
		if (this.state.loading)
			return <Backdrop open={this.state.loading} color='#fff' />;
		else return <h1>This is the answers screen</h1>;
	}
}
