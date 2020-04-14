// Show that we've loaded the JavaScript file
console.log("Loaded comparison.js");

// Query the endpoint that returns a JSON ...
var comparison = "/api/v1.0/comparison";

d3.json(comparison, (function(error, jsonData) {
    if (error) throw error;
    console.log("Comparison Data:", jsonData);
    var dataPoints = [];

    var chart = new CanvasJS.Chart("chartContainer1",
        {theme: "light2",
        animationEnabled: true,
        title:{
            text:"Top 20 Countries (ranked by cheapest to more expensive)",
            padding: 10,
            margin: 20,
            fontSize: 20,
            wrap: true,
        },
        axisX: {
        interval: 1,
        labelAngle: -90,
        labelFontSize: 14
        },
        axisY:{
        // interlacedColor: "rgba(1,77,101,.2)",	
        // gridColor: "rgba(1,77,101,.1)",
        title: "Price Range",
        titleFontSize: 20,
        titleFontWeight: "bold",
        labelFontSize: 14,
        valueFormatString: "$#0.#00"
        },
        data: [{
        type: "rangeColumn",
        /* color: "#014D65", */
        //xValueFormatString:"D MM h:mm",
        name: "series1",
        indexLabel: "{y[#index]}",
        indexLabelFontSize: 12,
        yValueFormatString: "$#0.00",
        toolTipContent: "{label}<br>High: {y[1]}<br>Low: {y[0]}",
        dataPoints: dataPoints // this should contain only specific serial number data  
        }]
        }
    );

    $( ".dropdown" ).change(function() {
        chart.options.data[0].dataPoints = [];
        var e = document.getElementById("dd");
        var selected = e.options[e.selectedIndex].value;
        dps = jsonData[selected];
        dps.sort(function(a,b) {return a.y[0]-b.y[0]});

        console.log(dps);

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

        var chart_data = [];

        var counter = 20

        for (var i = 0; i < dps.length; i++) {  
            if (dps[i].y[1] === null) {
                counter += 1
            };
        }

        // console.log(counter)

        for (var i = 0; i < counter; i++) {
            if (dps[i].y[1] > 0) {
                chart_data.push(dps[i]);
                chart_data.sort(function(a,b) {return a.y[0]-b.y[0]});
            };
        }

        // console.log(chart_data)

        for(var i in chart_data) {
            y_value = [];
            y_value.push(chart_data[i].y[0]);
            y_value.push(chart_data[i].y[1]);
            chart.options.data[0].dataPoints.push({label: chart_data[i].label, y: y_value});
        }

        chart.render();

    })
}));
