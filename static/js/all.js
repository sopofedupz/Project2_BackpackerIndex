function onClick(e) {
  alert(this.getLatLng());
}

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

//function for initial landing page
function initDashboard() {
  
  // fetch the html selector for drop-down menu
  var selector = d3.select("#selDataset");

  // get data to include in drop-down
  var cities_link = "/api/v1.0/citiesName";

  d3.json(cities_link, (function(error, jsonData) {
    if (error) throw error;
    // console.log(jsonData);
          
    // create variable to hold names
    jsonData.forEach((city) => {
      selector
        .append("option")
        .text(city)
        .property("value", city)
    });

    // set the initial data to the first city
    var city = jsonData[0];

    console.log(city);
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

    // Fetch new data each time a new sample is selected

    //////////////////////////////////////////////////////////
    // INSERT H AND JJ'S FUNCTION HERE. THIS IS A PLACEHOLDER
    //////////////////////////////////////////////////////////
    // function(newCity)

}

// call initial landing page function to get landing page to display
initDashboard();
