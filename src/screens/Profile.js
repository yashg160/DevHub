import React from 'react';
import Tabs from './tabs/Tabs';
import './styles/tabs.css';

export default class Profile extends React.Component {
	render() {
		return (
			<div>
				<h1>Tabs Here</h1>
				<Tabs>
					<div label='Gator'>
						See ya later, <em>Alligator</em>!
					</div>
					<div label='Croc'>
						After 'while, <em>Crocodile</em>!
					</div>
					<div label='Sarcosuchus'>
						Nothing to see here, this tab is <em>extinct</em>!
					</div>
				</Tabs>
			</div>
		);
	}
}
