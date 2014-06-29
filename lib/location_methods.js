var sort_distances = function (locations, res) {
	locations.sort(function(a, b) {return a.duration - b.duration;});
	var result = locations[0];
	locations[0]['info_sheet'] = locations.info_sheet;
  if (res[0]=='+'){
    var client = require('twilio')('ACec64a5b0feb7121fd6a33718d1fc4390', '0a4ecac03a0cb832a0cbfd221c329b20');
    // Use this convenient shorthand to send an SMS:
    console.log(result);
    client.sendSms({
          to: res,
          from:'+19513833688',
          body: result['facility'] + '\nat ' + result['location_1']['human_address']['address'] + '.\nCall: ' + result['phone']
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
  else {
    res.send(result);
  }
}

var async = function(locations, i, current_location, distances, res) {
	gd(locations, current_location, distances, i, res);
}

var func_final = function(distances, locations, res) {
	sort_distances(locations, res);
}

var get_choice = function(locations, current_location, res) {
	var distances = [];
	for (var i = 0; i < locations.length; i++) {
		async(locations, i, current_location, distances, res);
	}
}

var gd = function(locations, current_location, distances, i, res) {
	var distance = require('google-distance');

	var lat = locations[i].location_1.latitude;
	var longitude = locations[i].location_1.longitude;
	var my_origin = lat.concat(',').concat(longitude);

	var dest_lat = current_location[0].latitude;
	var dest_long = current_location[0].longitude;
	var my_destination = dest_lat.concat(',').concat(dest_long);

	distance.get(
	{
		origin: my_origin,
		destination: my_destination,
		units: 'imperial'
	},
	function(err, data) {
		if (err) return console.log(err);
		locations[i].duration =  data.durationValue;
		distances.push(data.durationValue);

		if (distances.length == locations.length) {
			func_final(distances, locations, res);
		}
	});
} 

var get_top_choice = function(locations, current_location, res) {
	// assume current_location is json with "latitude" and "longitude" entries
	// locations is json where lat/long are under "location_1" key
	get_choice(locations, current_location, res);
}

var get_json = function(data) {
	return data;
}

exports.get_info_sheet = function(material, all_objects, current_location, res){
	var unirest = require('unirest');
	var url = 'http://data.countyofriverside.us/resource/4yyp-e7qt.json?$q='.concat(material);
	unirest.get(url)
				.end(function (data) {
					var material_info = [
						{"info_sheet" : data['body'],
						"location_information" : all_objects}];
					material_info[0].location_information['info_sheet'] = material_info[0].info_sheet;
					get_top_choice(material_info[0].location_information, current_location, res);
					// return material;
				});
}

exports.get_greeenwaste_recyclers = function(material, all_objects, info_sheet_function, current_location, res) {
	var unirest = require('unirest');
	var url = 'http://data.countyofriverside.us/resource/76h8-zrhh.json?$q='.concat(material);
	unirest.get(url)
			.end(function (data) {
				for (var i = 0; i < data['body'].length; i++) {
					var addr_json = JSON.parse(data['body'][i]['location_1']['human_address'])
					var obj_info = {"phone" : data['body'][i]['phone'],
									"facility" : data['body'][i]['facility'],
									"location_1" : {
										"latitude" : data['body'][i]['location_1']['latitude'],
										"longitude" : data['body'][i]['location_1']['longitude'],
										"human_address" : addr_json,
									},
								};
					all_objects.push(obj_info);
				}
				info_sheet_function(material, all_objects, current_location, res);
			});
}


exports.get_locations = function(input, info_sheet_function, greenwaste_function, current_location, res) {
  // assumes input is a material that is listed on the database material_accepted
  var unirest = require('unirest');
  var info_sheet;
  var url = 'http://data.countyofriverside.us/resource/fp33-e7hd.json?$q='.concat(input);
  unirest.get(url)
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
		greenwaste_function(input, all_objects, info_sheet_function, current_location, res);
	});

}

