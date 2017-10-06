// Require .env NPM package
require('dotenv').config();

// Require twit NPM package.
const Twit = require( 'twit' );

// Require axios NPM package.
const axios = require( 'axios' );

// Helper functions
const { randomNum } = require('./helpers.js');

// Pass object to twit package.
const T = new Twit( {
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Variable for key.
const key = process.env.KEY;

// How many ms in an hour?
const hour = 3600000;

// Variable for setting time interval.
const tweetInterval = hour * 8; // for actual bot timing
// const tweetInterval = 10000; // for testing bot timing

// Get the twitter user stream (for responses to JordyBot).
const stream = T.stream('user');

// Return random number. Moved into helper file
// function randomNum( length ) {
// 	return Math.floor( Math.random() * length );
// }


// Tweet the final deal.
function saySomething( X ) {

	const tweet = {
		status: `"${ X }"`
	}

	T.post('statuses/update', tweet, tweeted);

	// console.log(); // for testing

	function tweeted(err, data, response) {
		if (err) {
			console.log( 'Uh oh, something askew.' );
		} else {
			console.log( 'Woo, it worked!' );
		}
	}
}

// 1.) Set interval
setInterval( X, tweetInterval );


// Create an event when someone tweets JordyBot.
stream.on('tweet', tweetEvent);

function tweetEvent( hexCodes ) {

	// Create boolean for seeing if it's a reply.
	let isReply = false;

	// Did they @ me?
	const replyTo = hexCodes.in_reply_to_screen_name;

	// Reset boolean to true if they were talking to little ol' JordyBot.
	if ( replyTo === 'name_of_bot' ) {
		isReply = true;
	}

	// Content of tweet.
	const content = hexCodes.text.toLowerCase();

	// Who is talking to me?
	const name = hexCodes.user.screen_name;

	// Set response as empty string.
	let response = '';

	// Were they talking to JordyBot? If so, then...
	if ( isReply ) {


		// If it isn't an empty string...respond accordingly.
		if ( response !== '' ) {
			// console.log(response);
			responseTweet('@' + name + ' ' + response);
		}
	}
}

// Tweet it out, loud + proud.
function responseTweet( txt ) {

	// Content of response tweet.
	const tweet = {
		status: txt
	}

	T.post('statuses/update', tweet, tweeted);

	function tweeted(err, data, response) {
		if (err) {
			console.log( 'Oops.' );
		} else {
			console.log( 'Response completed.' );
		}
	}
}
