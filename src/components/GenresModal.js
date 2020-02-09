import React from 'react';
import {
	Modal,
	Typography,
	Button,
	Fade,
	Backdrop,
	Chip
} from '@material-ui/core';
import utils from '../utils';

export default class GenresModal extends React.Component {
	render() {
		return (
			<Modal
				aria-labelledby='modal-genres'
				aria-describedby='modal-add-genres'
				open={this.props.genresModal}
				onClose={() => this.setState({ genresModal: false })}
				closeAfterTransition
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
				BackdropComponent={Backdrop}
				BackdropProps={{ timeout: 500 }}>
				<Fade in={this.props.genresModal}>
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
							<Typography variant='h6'>Add Question</Typography>
						</div>

						<div style={{ padding: '1rem' }}>
							<div>
								<Typography
									variant='h6'
									style={{
										fontWeight: 700,
										marginBottom: '0.5rem'
									}}>
									Select genres to make you question more
									discoverable
								</Typography>
							</div>

							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
									justifyContent: 'center',
									alignItems: 'center',
									marginBottom: '0.5rem'
								}}>
								{this.props.genres.map((genre, i) => (
									<Chip
										key={i}
										label={genre}
										onClick={() => this.props.genreClick(i)}
										color={
											utils.checkUserInArray(
												this.props.selectedGenres,
												i
											)
												? 'secondary'
												: 'primary'
										}
										style={{
											padding: '0.5rem',
											color: '#fff',
											margin: '0.5rem'
										}}
									/>
								))}
							</div>
							<Typography align='center' variant='body1'>
								Select upto 5 genres
							</Typography>
							<div
								style={{
									padding: '2rem',
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
									alignItems: 'center'
								}}>
								<Button
									variant='text'
									onClick={() => this.props.cancelClick()}
									style={{
										marginRight: '0.2rem',
										textTransform: 'none'
									}}>
									Cancel
								</Button>
								<Button
									color='primary'
									variant='contained'
									onClick={() =>
										this.props.handleAddQuestion()
									}
									style={{
										marginLeft: '0.2rem',
										textTransform: 'none',
										color: '#fff'
									}}>
									Add question
								</Button>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>
		);
	}
}
