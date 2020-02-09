import React from 'react';
import {
	Modal,
	Typography,
	Button,
	Backdrop,
	Fade,
	Avatar,
	TextField
} from '@material-ui/core';
export default class QuestionModal extends React.Component {
	render() {
		return (
			<Modal
				aria-labelledby='modal-question'
				aria-describedby='modal-ask-question'
				open={this.props.questionModal}
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
				<Fade in={this.props.questionModal}>
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
									Tips on getting good answers quickly
								</Typography>

								<div style={{ marginTop: '1rem' }}>
									<Typography
										variant='body1'
										style={{ marginTop: '0.5rem' }}>
										Make sure your question hasn't been
										asked already
									</Typography>
									<Typography
										variant='body1'
										style={{ marginTop: '0.5rem' }}>
										Keep your question short and to the
										point
									</Typography>
									<Typography
										variant='body1'
										style={{ marginTop: '0.5rem' }}>
										Double-check grammar and spelling
									</Typography>
								</div>
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-start',
									marginTop: '1.5rem',
									marginBottom: '1.5rem',
									alignItems: 'center'
								}}>
								<Avatar
									src={this.props.user.avatar_url}
									alt={this.props.user.name}
									style={{
										height: '2rem',
										width: '2rem'
									}}
								/>
								<Typography
									variant='body1'
									style={{ marginLeft: '1rem' }}>
									Posting as {this.props.user.name}
								</Typography>
							</div>

							<div>
								<TextField
									id='question'
									label='Your Question'
									InputProps={{
										style: {
											fontSize: 26,
											fontWeight: 600
										}
									}}
									placeholder={
										'Start you question with "What," "Why," or "How."'
									}
									multiline
									rowsMax='3'
									fullWidth
									value={this.props.newQuestion}
									onChange={event =>
										this.props.onChange(event)
									}
									onFocus={() =>
										this.setState({
											newQuestionError: false
										})
									}
									error={this.props.newQuestionError}
									helperText={
										this.props.newQuestionError
											? 'Please check your question'
											: ''
									}
								/>
							</div>
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
									onClick={() => this.props.proceedClick()}
									style={{
										marginLeft: '0.2rem',
										textTransform: 'none',
										color: '#fff'
									}}>
									Proceed
								</Button>
							</div>
						</div>
					</div>
				</Fade>
			</Modal>
		);
	}
}
