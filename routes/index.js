// route for incoming ios msg service
exports.in_ios = function(req, res) {
  res.send('in ios');
}


// route for incoming twilio msg service
exports.in_twil = function(req, res) {
  res.send('in twil');
}