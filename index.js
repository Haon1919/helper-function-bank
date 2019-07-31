const isObject = item => typeof item === 'object';
const isArray = item => typeof item === Array.isArray(item);
const stringEquality = (searchTerm, item) => {
	if (item === null || item === undefined) return false;
	return (
		item
			.toString()
			.toUpperCase()
			.indexOf(searchTerm.toUpperCase()) !== -1
	);
};
//This function recursively checks each value in a possibly nested JSON object to see if it contains a sting match on any level.
function traverseItem(searchTerm, item) {
	if (item === null || item === undefined) return false;
	if (stringEquality(searchTerm, item)) return true;
	if (isObject(item) || isArray(item)) {
		for (let val of Object.values(item)) {
			if (stringEquality(searchTerm, val)) return true;
			if (isObject(val) || isArray(val)) {
				let childCallVal = traverseItem(searchTerm, val);
				if (childCallVal) return childCallVal;
			}
		}
		return false;
	}
}

function checkObjectEquality(a, b) {
	for (let key in a) {
		if (b[[key]] === undefined || b[[key]] !== a[[key]]) {
			return false;
		}
	}
	return true;
}

//This function returns an array that contains all indexes of objects matching a key value pair.
function indexOfObj(list, keyName, value) {
	let indexList = [];
	for (let obj of list) {
		if (obj[[keyName]] === value) indexList.append(list.indexOf(obj));
	}
	return indexList;
}


/*  This class takes a callback and runs it over a gradually increasing interval unless the callback changes. 
    It is useful in situations where you can not use web-sockets */
class Timer {
	constructor(callback) {
		this.callback = callback;
		this.time = [1, 3, 12, 300].map(t => t * 10000);
		this.timeIndex = 0;
		this.interval = setInterval(() => {
			this.callback();
		}, this.time[this.timeIndex]);
		this.increaseTime = setInterval(() => {
			if (this.timeIndex < this.time.length - 1) {
				clearInterval(this.interval);
				this.timeIndex += 1;
				this.interval = setInterval(() => {
					this.callback();
				}, this.time[this.timeIndex]);
			}
		}, 10 * 60 * 1000);
	}

	changeCallback(callback) {
		clearInterval(this.interval);
		clearInterval(this.increaseTime);

		this.timeIndex = 0;
		this.interval = setInterval(() => {
			callback();
		}, this.time[this.timeIndex]);

		this.increaseTime = setInterval(() => {
			if (this.timeIndex < this.time.length - 1) {
				clearInterval(this.interval);
				this.timeIndex += 1;
				this.interval = setInterval(() => {
					callback();
				}, this.time[this.timeIndex]);
			}
		}, 10 * 60 * 1000);
	}
	stop() {
		clearInterval(this.interval);
		clearInterval(this.increaseTime);
	}
}
