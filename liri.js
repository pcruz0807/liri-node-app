var dotenv = require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var request = require('request');

var fs = require('fs');

var moment = require('moment');

var inquirer = require('inquirer')


shows = function(text) {
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

theSpotify = function(text) {


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

