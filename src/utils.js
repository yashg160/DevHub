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

async function postComment(comment, answerId, parentComment = null) {
	const token = Cookies.get('TOKEN');
	console.log('Posting comment. TOKEN: ', token);
	let body;
	if (parentComment) {
		body = JSON.stringify({
			comment: comment,
			answer: answerId,
			parent_comment: parentComment
		});
	} else {
		body = JSON.stringify({
			comment: comment,
			answer: answerId
		});
	}
	console.log('Comment request body: ', body);
	let rawResponse = await fetch(serverUrl + '/api/comments', {
		method: 'POST',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: body
	});
	let res = await rawResponse.json();
	console.log(res);

	if (res.status === 'success') return 'success';
	else return 'failed';
}

async function updateComment(comment, upvote, removeUpvote, commentId) {
	const token = Cookies.get('TOKEN');
	console.log('Putting comment: ', token);
	let body;

	if (upvote) {
		body = JSON.stringify({
			comment: comment,
			upvote: true
		});
	} else {
		body = JSON.stringify({
			comment: comment,
			removeUpvote: true
		});
	}

	let rawResponse = await fetch(serverUrl + `/api/comments/${commentId}`, {
		method: 'PUT',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: body
	});

	let res = await rawResponse.json();
	console.log(res);

	if (res.status === 'success') return 'success';
	else return 'failed';
}

async function getAllUsers(next, questionUrl) {
	const token = Cookies.get('TOKEN');
	let url = null;
	if (next) url = next;
	else url = serverUrl + `/requested/${questionUrl}`;

	let rawResponse = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	let res = await rawResponse.json();
	if (rawResponse.status === 200) return res;
	else throw Error('ERR_GET_USERS');
}

async function getGenres() {
	const token = Cookies.get('TOKEN');
	let rawResponse = await fetch(`${serverUrl}/api/genre`, {
		method: 'GET',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json'
		}
	});

	let content = await rawResponse.json();
	console.log(content);
	if (content.status !== 'success') throw Error('ERR_GENRES');
	return content;
}

async function checkQuestion(newQuestion) {
	if (newQuestion.length < 1) {
		throw Error('ERR_CHECK');
	}
}

async function postQuestion(selectedGenres, genresList, newQuestion) {
	// In state, selected genres contain the indices for the genre tags. Use these to get the tags from the genre array.
	let genres = [];
	selectedGenres.map(i => genres.push(genresList[i]));
	console.log(genres);

	const token = Cookies.get('TOKEN');
	let rawResponse = await fetch(serverUrl + '/api/questions', {
		method: 'POST',
		headers: {
			Authorization: `Token ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			question: newQuestion,
			genres: genres
		})
	});

	let res = await rawResponse.json();
	console.log(res);
	/* if (res.status !== 'success') throw Error('ERR_POST'); */
	return res;
}

async function getQuestionData(questionUrl) {
	const token = Cookies.get('TOKEN');
	let rawResponse = await fetch(serverUrl + `/api/questions/${questionUrl}`, {
		method: 'GET',
		headers: {
			Authorization: `Token ${token}`,
			Accept: 'application/json',
			'Content-Type': 'application/json'
		}
	});

	let res = await rawResponse.json();
	console.log(res);
	if (res.status !== 'success') throw Error('ERR_SERVER');
	return res;
}
export default {
	checkUserInArray,
	removeValueFromArray,
	followClick,
	requestClick,
	upvoteAnswerClick,
	getUser,
	postComment,
	updateComment,
	getAllUsers,
	getGenres,
	checkQuestion,
	postQuestion,
	getQuestionData
};
