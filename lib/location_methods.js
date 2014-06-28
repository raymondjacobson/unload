var get_top_choice = function(choices) {
}

exports.get_locations = function(input) {
  // assumes input is a material that is listed on the database material_accepted
  var unirest = require('unirest');
  unirest.get('http://data.countyofriverside.us/resource/fp33-e7hd.json')
  	.end(function (data) {
  		for (var key in data) {
  			if (data.hasOwnProperty(key)) {
  				console.log(data[key]);
  			}
  		}
  	})
  return input
}