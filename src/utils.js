import Cookies from 'js-cookie';
import serverUrl from './config';

function checkUserInArray(arr, userName) {
	for (let i = 0; i < arr.length; i++) if (arr[i] === userName) return true;
	return false;
}

function removeValueFromArray(arr, value) {
	var filteredArray = arr.filter(val => val !== value);
	return filteredArray;
}

async function followClick(event, url, followers, login) {
	//First we check if the user has already followed the question. If yes, unfollow it. Else, follow the question

	// Also prevent the panel from expanding or shrinking.
	event.stopPropagation();

	//Get the token as cookie
	var token = Cookies.get('TOKEN');

	var userFollowed = checkUserInArray(followers, login);

	if (userFollowed) {
		// User has already followed the question. Remove the follow.
		let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				unfollowed: true
			})
		});

		let res = await rawResponse.json();
		if (res.status === 'success') return 'removed';
	} else {
		// User has followed the question. Add the follow
		let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				followed: true
			})
		});

		let res = await rawResponse.json();
		if (res.status === 'success') return 'followed';
	}
	return;
}

async function requestClick(event, url, requested, login) {
	// Stop the panel from expanding or contracting
	event.stopPropagation();
	// First get the token from cookies
	const token = Cookies.get('TOKEN');

	// New request.
	let rawResponse = await fetch(serverUrl + `/api/questions/${url}`, {
		method: 'PUT',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			requested: [login]
		})
	});

	let res = await rawResponse.json();
	if (res.status === 'success') return 'success';
	else throw Error();

}

async function upvoteAnswerClick(answerId, upvoters, login) {
	// Get the token from cookies
	var token = Cookies.get('TOKEN');
	if (checkUserInArray(upvoters, login)) {
		// User has already upvoted. Remove the upvote
		let rawResponse = await fetch(serverUrl + `/api/answers/${answerId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				remove_upvote: true
			})
		});
		let res = await rawResponse.json();
		if (res.status === 'success') return 'removed';
		else throw Error();
	} else {
		// Upvote the answer by this user
		let rawResponse = await fetch(serverUrl + `/api/answers/${answerId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Token ${token}`,
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				upvote: true
			})
		});

		let res = await rawResponse.json();
		if (res.status === 'success') return 'upvoted';
	}
}

async function getUser() {
	const userName = Cookies.get('USER_NAME');
	const token = Cookies.get('TOKEN');

	let rawResponse = await fetch(serverUrl + `/user/${userName}`, {
		method: 'GET',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	let res = await rawResponse.json();

	if (res.status !== 'success') throw Error('ERR_USER_FETCH');
	console.log(res);
	return res.data;

}
export default {
	checkUserInArray,
	removeValueFromArray,
	followClick,
	requestClick,
	upvoteAnswerClick,
	getUser
};
