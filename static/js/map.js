// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  COMING_SOON: new L.LayerGroup(),
  EMPTY: new L.LayerGroup(),
  LOW: new L.LayerGroup(),
  NORMAL: new L.LayerGroup(),
  OUT_OF_ORDER: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [20.0, 5.0],
  zoom: 2,
  layers: [
    layers.COMING_SOON,
    layers.EMPTY,
    layers.LOW,
    layers.NORMAL,
    layers.OUT_OF_ORDER
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Price per day < $30": layers.COMING_SOON,
  "Price per day < $60": layers.EMPTY,
  "Price per day < $100": layers.OUT_OF_ORDER,
  "Price per day < $137": layers.LOW
  // "Healthy Stations": layers.NORMAL,
 };

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomleft"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  COMING_SOON: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "blue",
    shape: "penta"
  }),
  EMPTY: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "yellow",
    shape: "penta"
  }),
  OUT_OF_ORDER: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "orange",
    shape: "penta"
  }),
  LOW: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "red",
    shape: "star"
  }),
  NORMAL: L.ExtraMarkers.icon({
    icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "green",
    shape: "penta"
  })
};


// // Query the endpoint that returns a JSON ..
var linkCoords = "/api/v1.0/coordsData";
var linkFacts = "/api/v1.0/facts";

d3.json(linkCoords, (function(error, jsonData1) {
  if (error) throw error;
  // console.log("Coords Data:", jsonData1);
  d3.json(linkFacts, (function(error, jsonData2) {
    if (error) throw error;
    // console.log("facts Data:", jsonData2);
    // Create an object to keep of the number of markers in each layer
       var stationCount = {
           COMING_SOON: 0,
           EMPTY: 0,
           LOW: 0,
           NORMAL: 0,
           OUT_OF_ORDER: 0
         };
        
    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    var stationStatusCode;
         // ########################
        //  ### need to fix this ###
        // #########################
      // Loop through the stations (they're the same size and have partially matching data)
    for ( var i=0; i < jsonData1.length; ++i ) {
            // console.log(jsonData);
      const factsData = jsonData2.filter(d => d.city_country == jsonData1[i].city_country);
      console.log(factsData);
      var station = factsData[0].daily_total_value;
      console.log(station);
      
      
      // If a station is listed but not installed, it's coming soon
      if (station < 30) {
        stationStatusCode = "COMING_SOON";
      }
      // If a station has no bikes available, it's empty
      else if (station >= 30 & station < 60) {
        stationStatusCode = "EMPTY";
      }
      // If a station is installed but isn't renting, it's out of order
      else if (station >= 60 & station < 100) {
        stationStatusCode = "OUT_OF_ORDER";
      }
      // If a station has less than 5 bikes, it's status is low
      else if (station >= 100 & station < 137) {
        stationStatusCode = "LOW";
      }
      // Otherwise the station is normal
      else {
        stationStatusCode = "NORMAL";
      }

      // Update the station count
      stationCount[stationStatusCode]++;
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([jsonData1[i].lat,jsonData1[i].lon], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup( "Destination:  "  + factsData[0].city_country  + "<br>" + "Avarage price: $" + factsData[0].daily_total_value + "<br>" + "Population: " + factsData[0].population + "<br>" + "Metro: " + factsData[0].metro + "<br>" + "Rank: " + factsData[0].rank + "<br>" + "Currency: " + factsData[0].currency + "<br>"  + "Timezone: " + factsData[0].timezone  + "<br>" + "Airport: " + factsData[0].airport);
    }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(station, stationCount);
//   }));
// }));

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, stationCount, icon) {
  document.querySelector(".legend").innerHTML = [
  
    // "<p class='out-of-order'> Price per day < $100: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='coming-soon'>Price per day < $30: " + stationCount.COMING_SOON  + "</p>",
    "<p class='empty'>Price per day < $60: " + stationCount.EMPTY + "</p>",
    "<p class='out-of-order'>Price per day < $100: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='low'>Price per day <$137: " + stationCount.LOW + "</p>",
    // "<p class='healthy'>Daily price >$0 " + stationCount.NORMAL + "</p>"
  ].join("");
 };
// };
}));
}));