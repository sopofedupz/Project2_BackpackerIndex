////////////////////////////////////////////////
// NOT SURE IF THIS SECTION WOULD WORK
////////////////////////////////////////////////

// function stateChange() {
//     am4core.disposeAllCharts();
//     let curState = this.value;
//    HenockChart(curState);
  
//     JJChart(curState);  
// }

////////////////////////////////////////////////
// END OF SECTION
////////////////////////////////////////////////

function onClick(e) {
  var coords_dp = this.getLatLng();
  var city_lat = coords_dp['lat'];
  var city_lng = coords_dp['lng'];

  var coords_link = "/api/v1.0/coordsData";

  d3.json(coords_link, (function(error, coords_data) {
    if (error) throw error;

    var found_city;
    for(var i = 0; i < coords_data.length; i++) {
      var nn = coords_data[i];
      if (nn.lat == city_lat && nn.lon == city_lng) {
        found_city = nn.city_country;
        optionChanged(found_city);
      }
    }
  }))
}

//function for initial landing page
function initDashboard() {
  
  // // fetch the html selector for drop-down menu
  // var selector = d3.select("#selDataset");

  // get data to include in drop-down
  var cities_link = "/api/v1.0/citiesName";

  d3.json(cities_link, (function(error, jsonData) {
    if (error) throw error;
    // console.log(jsonData);
          
    // // create variable to hold names
    // jsonData.forEach((city) => {
    //   selector
    //     .append("option")
    //     .text(city)
    //     .property("value", city)
    // });

    // // set the initial data to the first city
    // var city = jsonData[0];

    // console.log(city);
  }));

    //////////////////////////////////////////////////////////
    // INSERT H AND JJ'S FUNCTION HERE. THIS IS A PLACEHOLDER
    //////////////////////////////////////////////////////////
    // function(city)

}

  
//////////////////////////////////////////////////////////////////////////////
// HENOCK'S CHART FUNCTION HERE
//////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////////
// JJ'S CHART FUNCTION HERE
//////////////////////////////////////////////////////////////////////////////








// on change function
function optionChanged(newCity) {
  console.log(newCity);

    // Fetch new data each time a new sample is selected

    //////////////////////////////////////////////////////////
    // INSERT H AND JJ'S FUNCTION HERE. THIS IS A PLACEHOLDER
    //////////////////////////////////////////////////////////
    // function(newCity)

}

// call initial landing page function to get landing page to display
initDashboard();
