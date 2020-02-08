import React from 'react';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles/';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import SnackbarContent from '@material-ui/core/SnackbarContent';


export default class CustomSnackbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbar: this.props.snackbar
        }
    }

    render() {
        return (
            <ThemeProvider theme={theme.theme}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={this.state.snackbar}
                    autoHideDuration={5000}
                    onClose={() => {
                        this.props.closeSnackbar(false);
                        this.setState({ snackbar: false });
                    }}>
                    <SnackbarContent
                        style={{ backgroundColor: '#41b578', color: '#fff' }}
                        message={this.props.message}
                        action={<IconButton
                            key='close'
                            aria-label='close'
                            color='secondary'
                            onClick={() => {
                                this.props.closeSnackbar(false);
                                this.setState({ snackbar: false });
                            }
                            }>
                            <CloseIcon />
                        </IconButton>}
                    />
                </Snackbar>
            </ThemeProvider>
        )
    }
}