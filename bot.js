// Requires
const Twit = require( 'twit' ); // Require twit NPM package.
const exec = require( 'child_process' ).exec;
const fs = require( 'fs' );
const request = require( 'request' ); // Request for downloading files
const axios = require( 'axios' ); // Require axios NPM package.
const hexRgb = require('hex-rgb'); // Hex to RGB package.
const helpers = require('./helpers.js'); // Helper functions
require('dotenv').config(); // Require .env NPM package

// Testing Flag
const dev = false;

// Global VARS
const randomNum = helpers.randomNum;
const isHex = helpers.isHex;

// Pass object to twit package.
const T = new Twit( {
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
const key = process.env.KEY; // Variable for key.
const hour = 3600000; // How many ms in an hour?
// Variable for setting time interval.
const tweetInterval = hour * 8; // for actual bot timing
// const tweetInterval = 12000; // for testing bot timing

// Get the twitter user stream (for responses to bot).
const stream = T.stream('user');

// Initial bot functionality.
function tweetIt() {

	const colourOne = getRandomColours();
	const colourTwo = getRandomColours();

	var obj = {
		colour_0: colourOne,
		colour_1: colourTwo
	};

	const gradientCSS = ' linear-gradient( 90deg, rgb( ' + obj.colour_0 + ' ), rgb( ' + obj.colour_1 + ' ) );'
	createJsonFile(obj);

	var command = dev ? 'processing-java --sketch=`pwd`/assets/ --run' : './assets/assets';

	// Callback for command line process.
	function processing() {

		const filename = 'assets/output.jpeg';
		const params = {
			encoding: 'base64'
		}

		// Read the file made by Processing.
		var base64 = fs.readFileSync(filename, params);

		// Upload the media
		T.post('media/upload', { media_data: base64 }, uploaded);

		function uploaded(err, data, response) {

			const id = data.media_id_string;
			const tweet = {
				status: gradientCSS,
				media_ids: [id]
			};
			T.post('statuses/update', tweet, tweeted);
		}

		// Callback for when tweet is sent.
		function tweeted(err, data, response) {
			if (err) {
				console.log( 'Something went wrong...' );
			} else {
				console.log( 'It worked!' );
			}
		} // end tweeted
	} // end processing

	exec(command, processing);
} // end tweetIt

function getRandomColours() {
	const colourArr = [
		randomNum(256),
		randomNum(256),
		randomNum(256)
	];
	return colourArr;
}

function convertToRgb(hexArr) {
	// Object template:
	// {
	// 	colour_0: [255, 255, 255]
	// }
	var obj = {};

	for (var index = 0; index < hexArr.length; index++) {
		const rgbVal = hexRgb(hexArr[index]);
		obj[`colour_${index}`] = rgbVal;
	}
	createJsonFile(obj);
}

function createJsonFile(obj) {
	const json = JSON.stringify(obj);
		fs.writeFile('./assets/colourObj.json', json, 'utf8', () => {
		console.log( 'created json file!' );
	});
}

// Create an event when someone tweets Deltron_f.
stream.on('tweet', tweetEvent);

function tweetEvent(tweet) {

	// What's the deal with this tweet?
	const reply_to = tweet.in_reply_to_screen_name;
	const name = tweet.user.screen_name;
	const txt = tweet.text;
	const media = tweet.entities.media;
	const id = tweet.id_str;

	// You talking to me?
	if ( reply_to === 'deltron_f' ) {

		// Create an array from the tweet string, so we can iterate over the words
		const tweetArr = txt.split(' ');

		// User filter and map to iterate over the array.
		// Make sure the proposed hexcodes are indeed hexcodes.
		// Push them into a new array called legitArr.
		const legitHexArr = tweetArr
			.filter(word => word[0] === '#')
			.map(hash => hash.replace('#', ''))
			.filter(hash => hash.length === 6 || hash.length === 3)
			.filter(hash => isHex(hash))
			.slice(0, 2);

		if (legitHexArr.length === 2) {
			console.log(legitHexArr);
			convertToRgb(legitHexArr);
			gradientRequest(tweet, legitHexArr);
		} else {
			instructionsTweet(tweet);
			console.log("sending out instructions...");
		}
	}
} // End tweetEvent

// // Tweet it out, loud + proud.
function gradientRequest(tweet, legitHexArr) {
	console.log('start gradient request');

	const gradientCSS = ' linear-gradient( 90deg, #' + legitHexArr[0] + ', #' + legitHexArr[1] + ' );'
	const name = tweet.user.screen_name;
	const id = tweet.id_str;

	var command = dev ? 'processing-java --sketch=`pwd`/assets/ --run' : './assets/assets';

	// Callback for command line process.
	function processing() {

		console.log('processing function starting...');

		const filename = 'assets/output.jpeg';
		const params = {
			encoding: 'base64'
		}

		// Read pde file made by Processing.
		var base64 = fs.readFileSync(filename, params);

		// Upload media.
		T.post('media/upload', { media_data: base64 }, uploaded);

		function uploaded(err, data, response) {

			console.log("uploaded function starting..");

			const id = data.media_id_string;
			const tweet = {
				status: '@' + name + gradientCSS,
				in_reply_to_status_id: id,
				media_ids: [id]
			};
			T.post('statuses/update', tweet, tweeted);
		}

		// Callback for when tweet is sent.
		function tweeted(err, data, response) {
			if (err) {
				console.log( 'Something went wrong...' );
			} else {
				console.log( 'It worked!' );
			}
		} // end tweeted
	} // end processing
	exec(command, processing);
} // End gradientRequest

tweetIt();
setInterval( tweetIt, tweetInterval );
