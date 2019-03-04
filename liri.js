var dotenv = require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var fs = require('fs');

var moment = require('moment');
