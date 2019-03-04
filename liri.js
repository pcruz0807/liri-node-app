var dotenv = require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var request = require('request');

var fs = require('fs');

var moment = require('moment');


shows = function(text) {
request(request('https://rest.bandsintown.com/artists/' + text + '/events?app_id=codingbootcamp', function (err, response, body) {

    var json = JSON.parse(body);
    if (!json.length) {
        console.log("Sorry could not find anything for " + text +
            "\nShowing results for default concert");
        searchThis('concert-this');
    }
})
}