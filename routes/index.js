var location_methods = require('../lib/location_methods.js');

// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send(location_methods.get_locations('wood', location_methods.get_info_sheet, location_methods.get_greeenwaste_recyclers));
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
  res.send('in twil');
}