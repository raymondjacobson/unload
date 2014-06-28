var get_locations = require('../lib/get_locations.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send(get_locations.get_locations('asdf'));
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
  res.send('in twil');
}