var unirest = require('unirest');
var location_methods = require('../lib/location_methods.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send(location_methods.get_locations('asdf'));
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
  res.send('in twil');
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