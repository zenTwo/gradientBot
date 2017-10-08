// Requires
const Twit = require( 'twit' ); // Require twit NPM package.
const exec = require( 'child_process' ).exec;
const fs = require( 'fs' );
const request = require( 'request' ); // Request for downloading files
const axios = require( 'axios' ); // Require axios NPM package.
const hexRgb = require('hex-rgb'); // Hex to RGB package.
const helpers = require('./helpers.js'); // Helper functions
require('dotenv').config(); // Require .env NPM package

// Global vars
const dev = false;

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
// const tweetInterval = hour * 8; // for actual bot timing
const tweetInterval = 12000; // for testing bot timing

// Get the twitter user stream (for responses to bot).
const stream = T.stream('user');

tweetIt();

setInterval( tweetIt, tweetInterval );

// Initial bot functionality.
function tweetIt() {

	var command = dev ? 'processing-java --sketch=`pwd`/assets/ --run' : './assets/assets';

	exec(command, processing);

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
				status: '#TotallyWorks',
				media_ids: [id]
			}
			T.post('statuses/update', tweet, tweeted);
		};

		// Callback for when tweet is sent.
		function tweeted(err, data, response) {
			if (err) {
				console.log("Something went wrong...");
			} else {
				console.log("It worked!");
			}
		}; // end tweeted
	} // end processing
} // end tweetIt
