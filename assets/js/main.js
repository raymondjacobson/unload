var map;
var webmap = "1a3e58ce2c2849088018cfb491d33177";

var createMap = function(long, lat){
  require([
      "esri/arcgis/utils",
      "esri/config",
      "dojo/dom",
      "dojo/_base/array",
      "esri/Color",
      "dojo/parser",
      "dijit/registry",
      
      "esri/urlUtils",
      "esri/map",
      "esri/lang",
      "esri/graphic",
      "esri/InfoTemplate",
      "esri/layers/GraphicsLayer",
      "esri/renderers/SimpleRenderer",

      "esri/geometry/Point",
      "esri/tasks/FeatureSet",

      "esri/tasks/ClosestFacilityTask",
      "esri/tasks/ClosestFacilityParameters",

      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      
      "dijit/form/ComboBox",
      "dijit/layout/BorderContainer",
      "dijit/layout/ContentPane"
    ], function(arcgisUtils, esriConfig, dom, array, Color, parser, registry,
      urlUtils, Map, esriLang, Graphic, InfoTemplate, GraphicsLayer, SimpleRenderer, 
      Point, FeatureSet, 
      ClosestFacilityTask, ClosestFacilityParameters, 
      SimpleMarkerSymbol, SimpleLineSymbol
    ) { 
      var incidentsGraphicsLayer, routeGraphicLayer, closestFacilityTask;
      parser.parse();
      urlUtils.addProxyRule({
        urlPrefix: "route.arcgis.com",  
        proxyUrl: "/proxy.ashx"
      });
      // esriConfig.defaults.io.proxyUrl = "/proxy";

      arcgisUtils.createMap(webmap,"map").then(function(response){
        map = response.map;
        setTimeout(function(){
          moveMap(long, lat);

          // add facilities
          var facilityPointSymbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_SQUARE, 
            20,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([89,95,35]), 2
            ),
            new Color([130,159,83,0.40])
          ); 

          var facilitiesGraphicsLayer = new GraphicsLayer();
          var facilityRenderer = new SimpleRenderer(facilityPointSymbol);
          facilitiesGraphicsLayer.setRenderer(facilityRenderer);
         
          map.addLayer(facilitiesGraphicsLayer);

          constructDataObjs(facilitiesGraphicsLayer);

           // Handle logic for finding closest resource
          console.log('maploaded');
          $('input[type=submit]').click(function(){
            $('iframe').remove();
            var API_KEY = 'AIzaSyC9V_MOy-7Oakd7CXgmB33Xas0R31K0LUU';
            var ORIGIN = '(34.2767, -118.3105)';
            ORIGIN = '(' + lat + ',' + long + ')';
            var DESTINATION = '(34.1767, -118.3105)';
            var g_map_content = "https://www.google.com/maps/embed/v1/directions?key="+API_KEY+"&origin="+ORIGIN+"&destination="+DESTINATION;
            var iframe_string = "<iframe frameborder='0' style='border:0' src='"+g_map_content+"'></iframe>";
            $('.map-wrapper').remove();
            $('.container').append("<div class='row map-wrapper'></div>");
            $('.map-wrapper').append(iframe_string);
            $('.map-wrapper').append('<div class="instr"><h1>Step-by-step</h1></div>');
            $.get('/gmaps?origin='+ORIGIN+'&dest='+DESTINATION).done(function(data){
              var steps = data.body['routes'][0]['legs'][0]['steps'];
              console.log(steps);
              for (var i=0; i<steps.length; ++i){
                $('.instr').append("<p>"+steps[i]['html_instructions']+"</p>");
              }
            });
          });
        }, 400);
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

var addPoint = function(facilitiesGraphicsLayer, point){
  require(["esri/graphic"], function(Graphic) {
    // var marker = makeMarker(12, [255, 255, 255, 128], -122.5, 37.5);
    var marker = makeMarker(point['size'], point['color'], point['long'], point['lat']);
    facilitiesGraphicsLayer.add(new Graphic(marker));
  });
}

var addToMap = function(facilitiesGraphicsLayer, data){
  for(var i=0; i<data.length; ++i){
    point = {
      'size': 12,
      'color': [255, 180, 180, 128],
      'long': data[i]['location_1']['longitude'],
      'lat': data[i]['location_1']['latitude']
    }
    addPoint(facilitiesGraphicsLayer, point);
  }
}

var constructDataObjs = function(facilitiesGraphicsLayer){
  var data;
  $.get("http://data.countyofriverside.us/resource/fp33-e7hd.json", function(data1){
    $.get("http://data.countyofriverside.us/resource/76h8-zrhh.json", function(data2){
      data = data1.concat(data2);
      console.log(data);
      addToMap(facilitiesGraphicsLayer, data);
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
