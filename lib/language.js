// functions to get the real meaning of inputs (either sms or web/ios)
var unirest = require('unirest');
var AlchemyAPI = require('alchemy-api');
var ALCHEMY_API_KEY = "c8971d4a6fa31dae5668ba92196018945d6f4a73"
var alchemy = new AlchemyAPI(ALCHEMY_API_KEY);

var types = [
"appliances",
"asphalt",
"asphalt roofing shingles",
"branches",
"brick",
"cardboard",
"clean concrete",
"concrete w/ rebar",
"dirt",
"drywall",
"grass clippings",
"leaves",
"metal",
"mixed asphalt/concrete",
"pallets",
"palm fronds",
"rock/arcos",
"scalping",
"toilets",
"tree trimming",
"wood",
"wood waste"]

var translate = function(input){
  if (input.toLowerCase() == 'microwave'){
    return "appliances";
  }
  if (input.toLowerCase() == 'tree'){
    return "wood";
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

// var bs = 'microwave at riverside street and dupont avenue'
// var string = 'microwave';
// typify(string);
// breakup(bs);
// geocode('berkley st and bayard blvd')