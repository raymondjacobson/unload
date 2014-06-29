var unirest = require('unirest');
var location_methods = require('../lib/location_methods.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send(location_methods.get_locations('wood', location_methods.get_info_sheet, location_methods.get_greeenwaste_recyclers));
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
	console.log(req.body);
	console.log(req.body['Body']);
	var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
    
  // Use this convenient shorthand to send an SMS:
	client.sendSms({
		    to: req.body['From'],
		    from:'+19513833688',
		    body: req.body['Body']
		}, function(error, message) {
		    if (!error) {
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		        console.log('Message sent on:');
		        console.log(message.dateCreated);
		    } else {
		        console.log('Oops! There was an error.');
		    }
		}
	);
}


// web interface route
exports.index = function(req, res) {
  res.render('index', {
    title: 'unload'
  })
}

exports.gmaps = function(req, res) {
  var API_KEY = 'AIzaSyC9V_MOy-7Oakd7CXgmB33Xas0R31K0LUU';
  var ORIGIN = req.query['origin'];
  var DESTINATION = req.query['dest'];
  var string = "http://maps.googleapis.com/maps/api/directions/json?origin="+ORIGIN+"&destination="+DESTINATION;
  unirest.get(string).end(function(data){
    console.log('end');
    res.send(data);
  });
}

// gets the incoming loc & item and returns closest loc
exports.dconverter = function(req, res) {
  var loc = req.query['loc'];
  var item = req.query['item'];
  console.log(loc, item);
}