var map;
var webmap = "1a3e58ce2c2849088018cfb491d33177";

var createMap = function(long, lat){
  require(["dojo/parser",
    "esri/map",
    "esri/arcgis/utils",
    "dojo/domReady!"], function(parser, Map, arcgisUtils) { 
      parser.parse();
      arcgisUtils.createMap(webmap,"map").then(function(response){
        map = response.map;
        setTimeout(function(){
          moveMap(long, lat);
          constructDataObjs();
        }, 1000);
      });
  });
}

var makeMarker = function(size, color, long, lat){
   var marker = {
    "geometry": {
      "x":long,
      "y":lat,
      "spatialReference": {
        "wkid":4326
      }
    },
    "attributes": {
      "XCoord":long,
      "YCoord":lat,
    },
    "symbol":{
      "color":color,
      "size":size,
      "angle":0,
      "xoffset":0,
      "yoffset":0,
      "type":"esriSMS",
      "style":"esriSMSCircle",
      "outline":{
        "color":[0,0,0,255],
        "width":1,
        "type":"esriSLS","style":"esriSLSSolid"
      }
    }
  };
  return marker;
}

var moveMap = function(long, lat){
  require(["esri/geometry/Point",
    "esri/graphic"], function(Point, Graphic) {
    var point = new Point( {"x": long, "y": lat, "spatialReference": {"wkid": 4326 } });
    var marker = makeMarker(12, [255, 255, 255, 128], long, lat);
    map.centerAt(point);
    map.graphics.add(new Graphic(marker));
  });
}

var addPoint = function(point){
  require(["esri/graphic"], function(Graphic) {
    // var marker = makeMarker(12, [255, 255, 255, 128], -122.5, 37.5);
    var marker = makeMarker(point['size'], point['color'], point['long'], point['lat']);
    map.graphics.add(new Graphic(marker));
  });
}

var addToMap = function(data){
  for(var i=0; i<data.length; ++i){
    point = {
      'size': 12,
      'color': [255, 180, 180, 128],
      'long': data[i]['location_1']['longitude'],
      'lat': data[i]['location_1']['latitude']
    }
    addPoint(point);
  }
}

var constructDataObjs = function(){
  var data;
  $.get("http://data.countyofriverside.us/resource/fp33-e7hd.json", function(data1){
    $.get("http://data.countyofriverside.us/resource/76h8-zrhh.json", function(data2){
      data = data1.concat(data2);
      console.log(data);
      addToMap(data);
    })
  });
}

$(document).ready(function(){

  navigator.geolocation.getCurrentPosition(
    function(position) {
      createMap(position.coords.longitude,
        position.coords.latitude);
        
    }
  );
});
