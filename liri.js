//Requirements

var fs = require("fs");
var request = require("request");
var keys = require("./keys/keys.js");
var twitter = require("twitter");
var Spotify = require('node-spotify-api');
var operator = process.argv[2];
var input = process.argv[3];
var data;


//LIRI operators:

switch (operator){
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
	default:
		console.log("\r\n" + "List of operators:" + "\r\n" + 
					"* my-tweets" + "\r\n" + 
					"* spotify-this-song" + "\r\n" + 
					"* movie-this " + "\r\n" + 
					"* do-what-it-says");
}

//Twitter api

function myTweets(){

 	var client = new twitter({
	  consumer_key: keys.twitterKeys.consumer_key,
	  consumer_secret: keys.twitterKeys.consumer_secret,
	  access_token_key: keys.twitterKeys.access_token_key,
	  access_token_secret: keys.twitterKeys.access_token_secret
	});


	var argument = {screen_name: 'michaelc0019', count: 20};
	  
	client.get('statuses/user_timeline', argument, function(error, tweets, response) {
  		if (!error) {

  			console.log("\r\n" + "--------------------- My Tweets ---------------------" + "\r\n");

  			for( var i = 0; i < tweets.length; i++){

  				var	tweetResponce = "Tweet #: " + i + ", " + "created:  " + tweets[i].created_at + "\r\n" +
	   				 tweets[i].text + "\r\n" + "\r\n" +
	   				"-----------------------------------------------------" + "\r\n";

	   			console.log(tweetResponce);

  			}
  		}
  		else {
			console.log("Error: "+ error);
				return;
		}
		
	});	

}

//Spotify api

function spotifyThisSong(){

	var spotify = new Spotify({
			id: keys.spotifyKeys.id,
			secret: keys.spotifyKeys.secret
		});

		var songName = input;

		if(!songName){
			
			songName = "The Sign";
		}

		var argument = songName;

		spotify.search({ type: 'track', query: argument }, function(err, data) {

			if (err) {
				return console.log('Error: ' + err);
			} else {
				var spotifyResponce = "\r\n" + "-------------------- Here's the song you searched for: ---------------------" + "\r\n" +
										"Song Name: " + argument.toUpperCase() + "\r\n" + 
										"Artist(s): " + data.tracks.items[0].album.artists[0].name + "\r\n" +
										"Album: " + data.tracks.items[0].album.name + "\r\n" + 
										"Spotify Link: " + data.tracks.items[0].album.external_urls.spotify + "\r\n" + 
										"-----------------------------------------------------------------------------" + "\r\n";
								
				console.log(spotifyResponce);
			}
		});
	}

//OMDB api

function movieThis(){

	var movieName = input;

	if(!movieName){

		movieName = "mr nobody";
	}

	var argument = movieName;

	var movieQueryUrl = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=trilogy";

	request(movieQueryUrl, function(error, response, body){

	  
	if (!error && response.statusCode === 200){

	  
	  		var movieResponse = "\r\n" + "--------------------- " + JSON.parse(body).Title + " ----------------------" + "\r\n" + 
	   				"Year: " + JSON.parse(body).Year  + "\r\n" + 
	   				"IMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\r\n" + 
	   				"Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\r\n" + 
	   				"Country: " + JSON.parse(body).Country + "\r\n" + 
	   				"Language: " + JSON.parse(body).Language + "\r\n" + 
	   				"Plot: " + JSON.parse(body).Plot + "\r\n" + 
	   				"Actors: " + JSON.parse(body).Actors + "\r\n" +
	   				"-----------------------------------------------------";

			console.log(movieResponse);
		}
	else {
			console.log("Error: "+ error);
				return;
			}
	});
}