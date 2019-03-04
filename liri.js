var dotenv = require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var Spotify = require('node-spotify-api');

var request = require('request');

var fs = require('fs');

var moment = require('moment');

var inquirer = require('inquirer')


concertThis = function(text) {
    request('https://rest.bandsintown.com/artists/' + text + '/events?app_id=codingbootcamp', function (err, response, body) {

        var json = JSON.parse(body);

        if (!json.length) {
            console.log("Um yeah we could not find anything for " + text +
                "\nShowing results for default concert");
            searchThis('concert-this');
        } else {

            // console.log(json);
            console.log("\nVenue: " + json[0].venue.name +
                "\nLocation: " + json[0].venue.city + " " + json[0].venue.region + " " + json[0].venue.country +
                "\nEvent Date: " + moment(json[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));
        }
    });
};

spotifyThis = function(text) {


    spotify
        .search({ type: 'track', query: text, limit: 1 })
        .then(function (response) {

            if (!response.tracks.total) {
                console.log("So we could not find anything for " + text +
                    "\nShowing results for default song");
                searchThis('spotify-this-song');
            } else {

                console.log("\nArtists: " + response.tracks.items[0].artists[0].name +
                    "\nAlbum: " + response.tracks.items[0].album.name +
                    "\nSong: " + response.tracks.items[0].name +
                    "\nURL: " + response.tracks.items[0].preview_url
                );
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

movieThis = function (text) {

    request('http://www.omdbapi.com/?apikey=trilogy&t=' + text + '&tomatoes=true', function (err, response, body) {

        var json = JSON.parse(body);
        // console.log(json);
        if (json.Response == 'False') {
            console.log("So there is nothing for " + text +
                "\nShowing results for default movie");
            searchThis('movie-this');
        } else {
            // console.log(json);
            console.log("\nTitle: " + json.Title +
                "\nReleased: " + json.Year +
                "\nRating: " + json.imdbRating +
                "\nRotten Tomatoes Rating: " + json.tomatoRating +
                "\nCountry: " + json.Country +
                "\nLanguage: " + json.Language +
                "\nPlot: " + json.Plot +
                "\nActors: " + json.Actors);
        }
    });
};