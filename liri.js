require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require("twitter");
var latestTweets = require('latest-tweets');
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var operator = process.argv[2];
var input = process.argv[3];

  console.log("********");
  fs.appendFile('log.txt', "\n********\n", function (err) {
    if (err) throw err;
  });

  if(operator === 'my-tweets') {
    client.get('statuses/user_timeline', {status: "I am a tweet"}, function(error, tweets, response) {
      if (!error) {
        for( var i=0; i<tweets.length; i++) {
          console.log(tweets[i].text);
          fs.appendFile('log.txt', "my-tweets: " + tweets[i].text + "\n", function (err) {
            if (err) throw err;
          });
        }
      }
    });

  }
  else if(operator === 'spotify-this-song') {

    spotifyApi(input);

  } else if (operator === 'movie-this') {
      var inputtitle = '';
      for (var i=3; i<process.argv.length; i++ ) {
        inputtitle = inputtitle + process.argv[i] + " ";
      }
    // there is no user input for movie title
      if( process.argv.length == 3) {
        inputtitle = "Mr. Nobody";
      }

      movieThisApi(inputtitle);
      
  } else if (operator === 'do-what-it-says') {
      fs.readFile('random.txt', "utf8",function(err, data) {
        // console.log(data);
        var dataArr = data.split(",");

        spotifyApi(dataArr[1]);

      });

  } else {
      console.log("unknown operator");
  }

  function movieThisApi(inputtitle) {
    var url = "http://www.omdbapi.com/?t=" + inputtitle + "&y=&plot=short&apikey=trilogy";
    // console.log(url);
    request(url, function(error, response, body) {

    // If there were no errors and the response code was 200 (i.e. the request was successful)...
    if (!error && response.statusCode === 200) {
      // console.log(response);
      var output = "Title: " + JSON.parse(body).Title + "\n" +
      "Year: " + JSON.parse(body).Year + "\n" +
      "The movie's rating is: " + JSON.parse(body).imdbRating + "\n" +
      "Country: " + JSON.parse(body).Country + "\n" +
      "Language: " + JSON.parse(body).Language + "\n" +
      "Plot: " + JSON.parse(body).Plot + "\n" +
      "Actors: " + JSON.parse(body).Actors;

      console.log(output);
      fs.appendFile('log.txt', "movie-this: " + inputtitle + "\n" + output, function (err) {
        if (err) throw err;
      });
    }
    });
  }

  function spotifyApi(input) {
    spotify
    .search({ type: 'track', query: input, limit: 1 })
    .then(function(response) {
      // console.log(response);

      var output = "Artist: " + JSON.stringify(response.tracks.items[0].artists[0].name) + "\n" +
      "Album name: " + JSON.stringify(response.tracks.items[0].name) + "\n" +
      "Spotify preview link: " + JSON.stringify(response.tracks.items[0].external_urls.spotify);

      console.log(output);

      fs.appendFile('log.txt', "spotify-this-song: " + input + "\n" + output, function (err) {
        if (err) throw err;
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  }