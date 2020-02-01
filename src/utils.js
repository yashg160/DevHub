function checkUserInArray(arr, userName) {
	for (let i = 0; i < arr.length; i++) if (arr[i] === userName) return true;
	return false;
}

function removeValueFromArray(arr, value) {
	var filteredArray = arr.filter(val => val !== value);
	console.log(filteredArray);
	return filteredArray;
}

export default { checkUserInArray, removeValueFromArray };
