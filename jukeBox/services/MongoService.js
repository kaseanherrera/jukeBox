// /services/MongoService.js

var mongoose = require('mongoose');
//new string 
//var amazonUri =     'mongodb://:@ec2-52-27-233-97.us-west-2.compute.amazonaws.com:27017/test';
//var dev = 'mongodb://:@ec2-52-27-233-97.us-west-2.compute.amazonaws.com:27017/test'
var test = 'mongodb://127.0.0.1:27018/test';
exports.connect = function() {
	var address = test;
	mongoose.connect(address);
	
	var db = mongoose.connection;
	
	db.once('open', function (callback) {
		  process.stdout.write("### Mongo Connection Opened: " + address + "\n");
		});
	
	db.on('error', console.error.bind(console, '!!! Mongo Connection Error:'));
	
	
}

 