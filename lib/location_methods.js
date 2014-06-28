var get_top_choice = function(choices) {
}

var get_json = function(data) {
	return data;
}

exports.get_info_sheet = function(material, all_objects){
	var unirest = require('unirest');
	unirest.get('http://data.countyofriverside.us/resource/4yyp-e7qt.json?$q=wood')
				.end(function (data) {
					var material_info = [
						{"info_sheet" : data['body'],
						"location_information" : all_objects}];
					console.log(data['body']);
					console.log(all_objects);
					return material;
				});
}


exports.get_locations = function(input, info_sheet_function) {
  // assumes input is a material that is listed on the database material_accepted
  var unirest = require('unirest');
  var info_sheet;
  unirest.get('http://data.countyofriverside.us/resource/fp33-e7hd.json?$q=wood')
  	.end(function (data) {
  		var all_objects = [];
  		var data_json = JSON.parse(data['raw_body']);

  		for (var i = 0; i < data_json.length; i++ ) {
  			var result = [];
  			var addr_json = JSON.parse(data_json[i]['location_1']['human_address']);
  			var obj_info = {"phone" : data_json[i]['phone'],
  							"facility" : data_json[i]['facility'],
  							"location_1" : {
  								"latitude" : data_json[i]['location_1']['latitude'],
  								"longitude" : data_json[i]['location_1']['longitude'],
  								"human_address" : addr_json,
  							},
  						};

  			all_objects.push(obj_info);
		}
		info_sheet_function(input, all_objects);
	});

}

