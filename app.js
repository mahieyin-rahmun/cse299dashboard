// require the node modules needed
const express = require('express');
const $ = require('jquery');
const mongoose = require('mongoose');
require('dotenv').config();

// setup database connection parameters
var username = process.env.username;
var password = process.env.password;
const url = `mongodb://${username}:${password}@ds151840.mlab.com:51840/cse299`;
var options = { keepAlive: 300000, connectTimeoutMS: 30000, useNewUrlParser: true};

// localhost port
const port = 3000;

// define the model/structure of the database objects we want to query
var Sensor = mongoose.model('Sensor', {
	sensor_number: Number,
	toll: Number,
	time_occupied: Number,
	occupied: Boolean
});

// instantiate the express object
var app = express();

// set up the public folders that has view controllers, images and css files
app.use(express.static('public'));
// setup the templating engine to be used
app.set('view engine', 'ejs');

// when the user makes a get request to the server root
app.get('/', (req, res) => {
	// connect to the database
	mongoose.connect(url, options);
	// keep a reference to the connection variable
	var conn = mongoose.connection;
	// if any error occurs, print them out
	conn.on('error', console.error.bind(console, 'connection error:'));

	// once connected, show a success message
	conn.once('open', function() {
	    console.log('Connection established!');
	});

	// query the database for sensor data
	Sensor.find({}, (err, docs) => {
		// print out the errors (if any) and the obtained data (array of JSON objects)
		console.log(err);
		console.log(docs);

		// sort the array in ascending sensor number
		docs.sort((a,b) => a.sensor_number - b.sensor_number);

		// send the data to the client side along with the page in which they will be viewed in
		res.render('index', {
			docs: docs
		});
	});
});

// listen on the specified port for incoming requests
app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});