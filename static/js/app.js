

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
// d3.json(linkCoords).then(function(coordsData) {
  
//   // makers
// for ( var i=0; i < coordsData.length; ++i ) {
// var marker = L.marker([coordsData[i].lat, coordsData[i].lon])
// .bindPopup(coordsData[i].city_country)
// .addTo(mymap);
// }

// });

//pullthe data from facts table
d3.json(linkFacts).then(function(facts) {
  // console.log("facts:", facts);
});



// d3.json(linkCoords, (function(error, jsonData) {
//   if (error) throw error;
//   console.log("Data:", jsonData);
//   var dataPoints = [];

  
// }));


d3.json(linkCoords).then(function(coordsData) {
  d3.json(linkFacts).then(function(facts) {
  
    for ( var i=0; i < coordsData.length; ++i ) {
      const factsData = facts.filter(d => d.city_country == coordsData[i].city_country);
      // console.log("factsData:", factsData[0]);
      var marker = L.marker([coordsData[i].lat, coordsData[i].lon])
      .bindPopup("airport, " + factsData[0].airport + "\n rank " + factsData[0].rank)
      .addTo(mymap);
      
      
}
  
      // var popup = L.popup({
      //   $(popup).on('click', function(e){
      //     console.log("hi world");        
      //   })
      // })

      // function onMapClick(e) {
      //     console.log("hi world");
      // }
      // popup.on('click', onMapClick);
      // layer.bindPopup(popupContent).on("popupopen", () => {
      //   $(".delete-button").on("click", onMapClick)
      // })
  });
});


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
  







// // coloring for choropleth.
// function choseColor(p){
//     // min for all city price = $17, max  = $127
//     var color = "";
//     if (p > 100){
//       color = "#08306b";
//     }
//     else if (p > 80){
//       color = "#284d81";
//     }
//     else if (p > 60){
//       color = "#476997";
//     }
//     else if (p > 40){
//       color = "#6785ad";
//     }
//     else if (p > 20){
//       color = "#87a2c3";
//     }
//     else {
//       color = "#eef4fa";
//     }
//     return color;
//   }







// // Click event
// function onMapClick(e) {
//     alert("You clicked the map at " + e.latlng);
// }

// mymap.on('click', onMapClick);

var popup = L.popup();

function onMapClick(e) {
    // console.log("hi world");
}
popup.on('click', onMapClick);

