// Creating map
var mymap = L.map('map').setView([20.0, 5.0], 2);

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id:  "mapbox.streets",
  accessToken: API_KEY
}).addTo(mymap);

// Query the endpoint that returns a JSON ..
var linkCoords = "/api/v1.0/coordsData";
var linkFacts = "/api/v1.0/facts";



//pullthe data from coordonates table
d3.json(linkCoords).then(function(coordsData) {
  //pullthe data from facts table
  d3.json(linkFacts).then(function(facts) {
  
    for ( var i=0; i < coordsData.length; ++i ) {
      const factsData = facts.filter(d => d.city_country == coordsData[i].city_country);
      // console.log("factsData:", factsData[0]);
      var marker = L.marker([coordsData[i].lat, coordsData[i].lon])
      .bindPopup("airport, " + factsData[0].airport + "\n rank " + factsData[0].rank)
      .addTo(mymap);
      }
   
    
      
  });
  
});






var geojsonLayer = new L.GeoJSON.AJAX("countries.geo.json");
console.log(geojsonLayer);

d3.json(link, function(data) {
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        // fillColor: chooseColor(Feature.properties.name),
        fillColor: blue,
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        click: function(event) {
          map.fitBounds(event.target.getBounds());
        }
      });
    }
  }).addTo(mymap);
});
// d3.json(linkCoords, (function(error, jsonData) {
//   if (error) throw error;
//   console.log("Data:", jsonData);
//   var dataPoints = [];





  //add color to cities
  function style(feature) {
    //console.log(feature.opioidsTest);
    var cityToFind = feature.properties.city_country;
    var cityInfo = coordsData.filter(s=> s.city_country == cityToFind);
    var dailyValue = cityInfo[0]

    // console.log(cityInfo[0])

    return {
      fillColor: choroColor(dailyValue),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  // adds state outlines
  L.geoJson(statesData, {style: style}).addTo(mymap);


  // start highlight on mouse over
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  }

  geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(mymap);
  //end highlight on mouse over



//function for when the user selects a state
function optionChanged(newState){
  //functions for drawing graphs here
}

//function for initial landing page
function initDashboard(){
  var selector = d3.select("#selDataset");

  d3.json(deathsUrl).then((data)=>{
   //console.log(data);

    states.forEach((stateSelect)=>{
      selector.append("option")
        .text(stateSelect)
        .property("value", stateSelect)
    });

    var stateSelect = states[0];
  });

  //call functions here to draw the initial graphs for the landing page.

}

initDashboard();


// //pullthe data from coordonates table
// d3.json(linkCoords).then(function(coordsData) {
// // console.log("coordsData:", coordsData);
//     //  console.log(" first city in the list:", coordsData[1].lat, coordsData[1].lon);
//     var marker = L.marker([coordsData[1].lat, coordsData[1].lon]).addTo(mymap);

//      });
//      //pull the data from facts table
// d3.json(linkFacts).then(function(facts) {
//       // console.log("facts:", facts);
  
  





  
  
  
//implement the Event Listener 'onClick' on each Marker. ?????????




//   //create an event click holder
//   markersLayer.on("click", markerOnClick);

//   function markerOnClick(e) {
//     var attributes = e.layer.properties;
//     console.log(attributes.name, attributes.desctiption, attributes.othervars);
//     // do some stuff…
//   }
  







// coloring for choropleth.
function choseColor(p){
    // min for all city price = $17, max  = $127
    var color = "";
    if (p > 100){
      color = "#08306b";
    }
    else if (p > 80){
      color = "#284d81";
    }
    else if (p > 60){
      color = "#476997";
    }
    else if (p > 40){
      color = "#6785ad";
    }
    else if (p > 20){
      color = "#87a2c3";
    }
    else {
      color = "#eef4fa";
    }
    return color;
  }







// // Click event
// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }

// mymap.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    console.log("hi world");
}
popup.on('click', onMapClick);
