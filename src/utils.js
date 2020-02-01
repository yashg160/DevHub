import Cookies from 'js-cookie';
import serverUrl from './config';

function checkUserInArray(arr, userName) {
	for (let i = 0; i < arr.length; i++) if (arr[i] === userName) return true;
	return false;
}

function removeValueFromArray(arr, value) {
	var filteredArray = arr.filter(val => val !== value);
	console.log(filteredArray);
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
		console.log(res);
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
		console.log(res);
		if (res.status === 'success') return 'unfollowed';
	}
	return;
}

async function requestClick(event, url, requested, login) {
	// Stop the panel from expanding or contracting
	event.stopPropagation();
	// First get the token from cookies
	const token = Cookies.get('TOKEN');

	// Check if the user has already requested the answer. If yes, then remove the request on click. Else, add a request.
	const userRequested = checkUserInArray(requested, login);

	if (userRequested) {
		// User has already requested an answer. Remove the request ???
	} else {
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
		console.log(res);
		if (res.status === 'success') return 'success';
		else throw Error();
	}
}

export default {
	checkUserInArray,
	removeValueFromArray,
	followClick,
	requestClick
};
