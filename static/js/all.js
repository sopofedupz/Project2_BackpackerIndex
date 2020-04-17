function stateChange() {
    am4core.disposeAllCharts();
    let curState = this.value;
   HenockChart(curState);
  
    JJChart(curState);
  
  
  }
  
  stateSelector.on("change", stateChange);
  
  
  //function for when the user selects a state
  function optionChanged(newCity){
    //functions for drawing graphs here
    cityUpdate(newCity);
  }
  
  //function for initial landing page
  function initDashboard(){
    var stateSelector = d3.select("#selDataset1");
  
    d3.json(salesUrl).then(function(sales){
      salesRadialData = sales;
    HenockChart("...city...");
    });  
    d3.json(deathsUrl).then((deaths)=>{
      deathsData = deaths;
     JJChart("...city...");
      var stateName = [];
      for (var a = 0; a<statesData.features.length; a++){
        stateName.push(statesData.features[a].properties.city_name);
      }
      stateName.forEach((stateSelect)=>{
        stateSelector.append("option")
          .text(stateSelect)
          .property("value", stateSelect)
      });
      var stateSelect = stateName[0];
  
    
      
    });
  
    //call functions here to draw Henock's and JJ's  graphs for the landing page.
    
  
  }
  
  // call initial landing page function to get landing page to display
  initDashboard();
 