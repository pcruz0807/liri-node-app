require("dotenv").config();

var keys = require("./keys.js");

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

            
            console.log("\nVenue: " + json[0].venue.name +
                "\nLocation: " + json[0].venue.city + " " + json[0].venue.region + " " + json[0].venue.country +
                "\nEvent Date: " + moment(json[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a"));

            fs.appendFile('log.txt',"\r\n" + "\nArtist: " + text + "\r\n" + "\nVenue: " + json[0].venue.name + "\r\n" +
            "\nLocation: " + json[0].venue.city + " " + json[0].venue.region + " " + json[0].venue.country + "\r\n" +
            "\nEvent Date: " + moment(json[0].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a") + "\r\n", function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
};

spotifyThis = function(text) {


    var spotify = new Spotify(keys.spotify);

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

                fs.appendFile('log.txt', "\r\n" + "\nArtists: " + response.tracks.items[0].artists[0].name + "\r\n" +
                "\nAlbum: " + response.tracks.items[0].album.name + "\r\n" +
                "\nSong: " + response.tracks.items[0].name + "\r\n" +
                "\nURL: " + response.tracks.items[0].preview_url + "\r\n", function(err) {
                    if(err) {
                        console.log('error' + err);
                    }
                }); 
            }
        })
        .catch(function (err) {
            console.log(err);
        });
};

movieThis = function (text) {

    request('http://www.omdbapi.com/?apikey=trilogy&t=' + text + '&tomatoes=true', function (err, response, body, data) {

        var json = JSON.parse(body);

        
        if (json.Response == 'False') {
            console.log("So there is nothing for " + text +
                "\nShowing results for default movie");
            searchThis('movie-this');
        } else {
          
                console.log("\nTitle: " + json.Title + 
                "\nReleased: " + json.Year +
                "\nRating: " + json.imdbRating +
                "\nRotten Tomatoes Rating: " + json.tomatoRating +
                "\nCountry: " + json.Country +
                "\nLanguage: " + json.Language +
                "\nPlot: " + json.Plot +
                "\nActors: " + json.Actors);

         fs.appendFile('log.txt',"\r\n" + "\nTitle: " + json.Title + "\r\n" +
         "\nReleased: " + json.Year + "\r\n" +
         "\nRating: " + json.imdbRating + "\r\n" +
         "\nRotten Tomatoes Rating: " + json.tomatoRating + "\r\n" +
         "\nCountry: " + json.Country + "\r\n" +
         "\nLanguage: " + json.Language + "\r\n" +
         "\nPlot: " + json.Plot + "\r\n" +
         "\nActors: " + json.Actors + "\r\n", function(err) {
             if(err) {
                 console.log('Error', err);
             }
         });       
        }
       
        
    });

    
};

searchThis = function (command, searchtext) {

    switch (command) {
        case 'concert-this':
            {
                if (!searchtext) {
                    concertThis('Korn');
                } else {
                    concertThis(searchtext);
                }
                break;
            }
        case 'spotify-this-song':
            {
                if (!searchtext) {
                    spotifyThis('Rock you like a hurricane');
                } else {
                    spotifyThis(searchtext);
                }
                break;
            }
        case 'movie-this':
            {
                if (!searchtext) {
                    movieThis('Mr. Nobody');
                } else {
                    movieThis(searchtext);
                }
                break;
            }
        default:
            console.log("Try with valid options!");

    };
};

inquirer.prompt([
    {
        type: "list",
        name: "command",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        message: "Choose one of the options"
    },
    {
        name: "searchtext",
        message: "Type the Band/Song/Movie you are looking for..."
    }
]).then(function (answers) {

    if (answers.command === 'do-what-it-says') {
        //perform whats written in txt file.
        fs.readFile("random.txt", "utf8", function (err, data) {
            var answers = data.split(",");
            searchThis(answers[0], answers[1]);
        });
    }
    else {
        searchThis(answers.command, answers.searchtext);
    }

   
});
