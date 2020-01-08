import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Cookies from 'js-cookie';

export default class Genres extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            token: null
        }
    }

    componentDidMount() {
        var token = Cookies.get('TOKEN');
        this.setState({ token });

    }

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5">
                            Reactora
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Typography variant='h4' align='center'>
                    Genres
                </Typography>

                <Typography variant='body1' align='center'>
                    Select some genres that you find interesting. You will read about topics related to these genres
                </Typography>

                

            </div>
        )
    }
}