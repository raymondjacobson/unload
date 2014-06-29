var unirest = require('unirest');
var location_methods = require('../lib/location_methods.js');
var language = require('../lib/language.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
	var current_location = [{
		"latitude": "33.948769",
		 "longitude": "-117.380940"}];	
 	location_methods.get_locations('wood', location_methods.get_info_sheet, location_methods.get_greeenwaste_recyclers, current_location, res);
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
  var current_location = [{
    "latitude": "33.948769",
     "longitude": "-117.380940"}]; 
	console.log(req.body);
	console.log(req.body['Body']);
  response_location = location_methods.get_locations(
    'metal',
    location_methods.get_info_sheet,
    location_methods.get_greeenwaste_recyclers, current_location, req.body['From']);
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
  console.log(loc);
  var item = req.query['item'];
  var item_type = item;
  console.log(item_type);
  var current_location = [{
    "latitude": "33.948769",
     "longitude": "-117.380940"}];  
  console.log(current_location);
  response_location = location_methods.get_locations(
    'metal',
    location_methods.get_info_sheet,
    location_methods.get_greeenwaste_recyclers, current_location, res)
}
