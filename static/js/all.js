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

// set initial city to Hanoi, Vietnam and radio button to food and drinks
var city = "Hanoi, Viet Nam";
var radioValue = "fnb";

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
        city = found_city;
        optionChanged(city);        
      }
    }
  }))
}

//////////////////////////////////////////////////////
// THIS IS THE DROP DOWN CODE. REMOVE IF NOT IN USE
//////////////////////////////////////////////////////

//function for initial landing page
// function initDashboard() {
  
  // // fetch the html selector for drop-down menu
  // var selector = d3.select("#selDataset");

  // get data to include in drop-down
  // var cities_link = "/api/v1.0/citiesName";

  // d3.json(cities_link, (function(error, jsonData) {
  //   if (error) throw error;
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
  // }));

    //////////////////////////////////////////////////////////
    // INSERT H AND JJ'S FUNCTION HERE. THIS IS A PLACEHOLDER
    //////////////////////////////////////////////////////////
    // function(city)

// }

////////////////////////////////////////////////////////////////
// END OF SECTION
/////////////////////////////////////////////////////////////////

//function for initial landing page
function initDashboard() {
    
  tempGauge(city);
  percipGauge(city);
  generateChart();
  
}

  
//////////////////////////////////////////////////////////////////////////////
// HENOCK'S CHART FUNCTION HERE
//////////////////////////////////////////////////////////////////////////////
var url = "/api/v1.0/climate";

function cityCaller(city) {

  d3.json(url, (function(error, climate) {
    if (error) throw error;
    console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    console.log(city_index);


  }));
}



function tempGauge(city) {
  d3.json(url, (function(error, climate) {
    if (error) throw error;
    console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    // console.log(city_index);
  

    var myConfig = {
      type: "gauge",
      globals: {
        fontSize: 15
      },
      plotarea: {
        marginTop: 80
      },
      plot: {
        size: '100%',
        valueBox: {
          placement: 'center',
          text: '%v', //default
          fontSize: 15,
          rules: [{
              rule: '%v < 30',
              text: '%v<br>Freezing'
            },
            {
              rule: '%v >= 30 && %v < 60',
              text: '%v<br>Fair'
            },
            {
              rule: '%v >= 60 && %v < 90',
              text: '%v<br>Warm'
            },
            {
              rule: '%v >=  90',
              text: '%v<br>Hot'
            }
          ]
        }
      },
      tooltip: {
        borderRadius: 5
      },
      scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 120,
        step: 15,
        center: {
          visible: false
        },
        tick: {
          visible: false
        },
        item: {
          offsetR: 0,
          rules: [{
            rule: '%i == 9',
            offsetX: 15
          }]
        },

        ring: {
          size: 50,
          rules: [{
              rule: '%v < 30',
              backgroundColor: '#0B94FF'
            },
            {
              rule: '%v >= 30 && %v < 60',
              backgroundColor: '#0BFFC0'
            },
            {
              rule: '%v >= 60 && %v < 90',
              backgroundColor: '#FFA60B'
            },
            {
              rule: '%v >=  90',
              backgroundColor: '#FF290B'
            }
          ]
        }
      },
      refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 1500,
        resetTimeout: 1000
      },
      series: [{
        values: [climate[city_index].avg_temp],
        backgroundColor: 'black',
        indicator: [5, 1, 5, 1, .2],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        },
      }]
    };
  

    zingchart.render({
      id: 'tempGauge',
      data: myConfig,
      height: 500,
      width: '100%'
    });
  }));
}


function percipGauge(city) {
  d3.json(url, (function(error, climate) {
    if (error) throw error;
    // console.log(climate);

    var city_names = [];
    // Append each ID from the samplesData array to the samplesIDs list.
    climate.forEach((element, index) => {
      city_names.push(element.city_country);
    });

    var city_index = city_names.indexOf(city);
    // console.log(city_index);
    var myConfig = {
      type: "gauge",
      globals: {
        fontSize: 15
      },
      plotarea: {
        marginTop: 80
      },
      plot: {
        size: '100%',
        valueBox: {
          placement: 'center',
          text: '%v', //default
          fontSize: 15,
          rules: [{
              rule: '%v < 2',
              text: '%v<br>Little to No Rain'
            },
            {
              rule: '%v >= 2 && %v < 4',
              text: '%v<br>Light Rain'
            },
            {
              rule: '%v >= 4 && %v < 6',
              text: '%v<br>Moderate Rain'
            },
            {
              rule: '%v >=  6',
              text: '%v<br>Heavy Rain'
            }
          ]
        }
      },
      tooltip: {
        borderRadius: 5
      },
      scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 10,
        step: 2.5,
        center: {
          visible: false
        },
        tick: {
          visible: false
        },
        item: {
          offsetR: 0,
          rules: [{
            rule: '%i == 9',
            offsetX: 15
          }]
        },

        ring: {
          size: 50,
          rules: [{
              rule: '%v < 2',
              backgroundColor: '#0BFF85'
            },
            {
              rule: '%v >= 2 && %v < 4',
              backgroundColor: '#0BFFF8'
            },
            {
              rule: '%v >= 4 && %v < 6',
              backgroundColor: '#0BD6FF'
            },
            {
              rule: '%v >=  6',
              backgroundColor: '#0B94FF'
            }
          ]
        }
      },
      refresh: {
        type: "feed",
        transport: "js",
        url: "feed()",
        interval: 1500,
        resetTimeout: 1000
      },
      series: [{
        values: [climate[city_index].precipitation],
        backgroundColor: 'black',
        indicator: [5, 1, 5, 1, .2],
        animation: {
          effect: 2,
          method: 1,
          sequence: 4,
          speed: 900
        },
      }]
    };
      
    zingchart.render({
      id: 'precGauge',
      data: myConfig,
      height: 500,
      width: '100%'
    });
  }));
}






//////////////////////////////////////////////////////////////////////////////
// FUNCTION TO GENERATE RANGE COLUMN CHART
//////////////////////////////////////////////////////////////////////////////

function generateChart () {
  var data_link = "/api/v1.0/" + radioValue +"Data";
  
  d3.json(data_link, (function(error, jsonData) {
      if (error) throw error;
      // console.log(radio.value, ":", jsonData);

      var dataPoints1 = [];
      var chart1 = new CanvasJS.Chart("chartContainer1", {
          theme: "light2",
          animationEnabled: true,
          title:{
              // text:'Showing Price Range for {y}',
              padding: 10,
              margin: 20,
              fontSize: 20,
              wrap: true,
          },
          axisX: {
          interval: 1,
          labelFontSize: 12,
          labelAutoFit: true,
          labelAngle: 0
          },
          axisY:{
          title: "Price Range",
          titleFontSize: 20,
          titleFontWeight: "bold",
          labelFontSize: 14,
          valueFormatString: "$#0.00"
          },
          data: [{
              type: "rangeColumn",
              indexLabel: "{y[#index]}",
              indexLabelFontSize: 10,
              yValueFormatString: "$#0.00",
              toolTipContent: "{label}<br>High: {y[1]}<br>Low: {y[0]}",
              dataPoints: dataPoints1
          }]
      });
  
      // select data based on selected drop-down option
      chart1.options.data[0].dataPoints = [];

      // var selected = e.options[e.selectedIndex].value;
      dps = jsonData[city];    

      // console.log(city);

      // fix flipped low and high values and put it in the right order
      for (var i = 0; i < dps.length; i++) {
          if (dps[i].y[0] > dps[i].y[1]) {
              // console.log(`low price: ${dps[i].y[0]}`);
              // console.log(`high price: ${dps[i].y[1]}`);
              dps[i].y.push(dps[i].y[0])
              // console.log(`high price: ${dps[i].y[2]}`);
              dps[i].y.shift(dps[i].y[0]);
              // console.log(dps[i].y);
          };
      }

      // pushing data in to datapoints list
      for(var i = 0; i < dps.length; i++) {
          y_value = [];
          y_value.push(dps[i].y[0]);
          y_value.push(dps[i].y[1]);
          // console.log(y_value);
          chart1.options.data[0].dataPoints.push({label: dps[i].label, y: y_value});
      }

      chart1.render();
  }))
  
}

////////////////////////////////////////////////
// FUNCTION TO CALL THE RADIO BUTTON VALUE
////////////////////////////////////////////////

function OnChangeRadio (radio) {
  radioValue = radio.value;  
  generateChart();
  // console.log(radio.value)
}

//////////////////////////////////////////////////////
// FUNCTION TO PULL IN NEW DATA BASED ON CLICK ON MAP
//////////////////////////////////////////////////////

// on change function
function optionChanged(newCity) {
  console.log(`New city is picked: ${newCity}`);
  console.log(`Showing data for ${newCity}`)
  generateChart();
  tempGauge(newCity);
  percipGauge(newCity);  
}

// call initial landing page function to get landing page to display
initDashboard();
