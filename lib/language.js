// functions to get the real meaning of inputs (either sms or web/ios)
var unirest = require('unirest');
var AlchemyAPI = require('alchemy-api');
var ALCHEMY_API_KEY = "c8971d4a6fa31dae5668ba92196018945d6f4a73"
var alchemy = new AlchemyAPI(ALCHEMY_API_KEY);

var type_matrix = {
  'microwave': 'appliances',
  'oven': 'appliances',
  'dishwasher': 'appliances',
  'dryer': 'appliances',
  'refridgerator': 'appliances',
  'fridge': 'appliances',
  'heater': 'appliances',
  'toaster': 'appliances',
  'tree': 'wood',
  'branch': 'wood',
  'branches': 'wood',
  'table': 'wood',
  'chair': 'wood',
  'dresser': 'wood',
  'cabinet': 'wood',
  'cabinets': 'wood',
  'plank': 'wood',
  'dock': 'wood',
  'hardwood': 'wood',
  'posts': 'wood',
  'deck': 'wood',
  'asphalt': 'asphalt',
  'toilet': 'toilets',
  'concrete': 'concrete',
  'roof': 'asphalt',
  'roofing': 'asphalt',
  'drywall': 'drywall',
  'sheetrock': 'drywall',
  'leaves': 'leaves',
  'cardboard': 'cardboard',
  'brick': 'brick',
  'dirt': 'dirt',
  'grass': 'grass',
  'rock': 'rock',
  'metal': 'metal'
}

var translate = function(input){
  if (input in type_matrix){
    return type_matrix[input];
  }
  else {
    return 'toilet';
  }
}
exports.translater = function(input){
  return translate(input);
}

exports.geocode = function(addr){
  var API_KEY = 'AIzaSyC9V_MOy-7Oakd7CXgmB33Xas0R31K0LUU';
  var string = "https://maps.googleapis.com/maps/api/geocode/json?address="+addr+"&key="+API_KEY;
  unirest.get(string).end(function(data){
    console.log(data.body['results'][0]['geometry']['location']);
  });
}

exports.typify = function(item){
  alchemy.category(item, {}, function(err, response) {
    if (err) throw err;
    var category = response.category;
    console.log(category);
    return category;
  });
}

// breaks up incoming data into item and loc
exports.breakup = function(data, twil_helper){
   var current_location = [{
      "latitude": "33.948769",
       "longitude": "-117.380940"}]; 
   alchemy.keywords(data['Body'], {}, function(err, response) {
    if (err) throw err;
    var keywords = response.keywords;
    console.log(keywords);
    var API_KEY = 'AIzaSyC9V_MOy-7Oakd7CXgmB33Xas0R31K0LUU';
    var addr = keywords[0]['text'] + ' and ' + keywords[1]['text'];
    var string = "https://maps.googleapis.com/maps/api/geocode/json?address="+addr+"&key="+API_KEY;
    unirest.get(string).end(function(data2){
      console.log(data2.body['results'][0]['geometry']['location']);
      twil_helper(data['From'], translate(keywords[2]['text']), current_location);
    });
  });
}