
// Creating base layers for the map
const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

// Assemble API query URL
const url = "http://127.0.0.1:5000/";

// Grab the data with d3
d3.json(url).then((data) => {
  console.log(data);

  data = data.results;

  // for marker clusters instead of regular markers
  // const veryHighViolationsLayer = L.markerClusterGroup();
  // const highViolationsLayer = L.markerClusterGroup();
  // const avgViolationsLayer = L.markerClusterGroup();
  // const lowViolationsLayer = L.markerClusterGroup();
  // const veryLowViolationsLayer = L.markerClusterGroup();
  // const noViolationsLayer = L.markerClusterGroup();

  const veryHighViolationsLayer = L.layerGroup();
  const highViolationsLayer = L.layerGroup();
  const avgViolationsLayer = L.layerGroup();
  const lowViolationsLayer = L.layerGroup();
  const veryLowViolationsLayer = L.layerGroup();
  const noViolationsLayer = L.layerGroup();
  const machineLearningLayer = L.layerGroup();

  var fifteen_violations = 0;
  var ten_violations = 0;
  var five_violations = 0;
  var twohalf_violations = 0;
  var one_violation = 0;
  var zero_violations = 0;

  var five_star = 0;
  var quarterfive_star = 0;
  var fourhalf_star = 0;
  var fourquarter_star = 0;
  var four_star = 0;
  var three_star = 0;
  var two_star = 0;
  var one_star = 0;

  var star_array = [];
  var violation_array = [];

  // loop through the json
  data.forEach(function(response){
    // const name = response[0];
    const stars = response[4];
    const violation_count = response[3];
    const management_violations = response[4];
    const hygienic_violations = response[5];
    const food_prep_violations = response[6];
    const pests_rodents_violtations = response[7];
    const utensils_equipment_violations = response[8];
    const phyisical_facilities_violations = response[9];
    const compliance_violations = response[10];
    const inspection_type = response[11];
    const risk = response[12];
    const result = response[13];
    const name = response[14];
    const lat = response[15];
    const long = response[16];
    const logistic_model_prediction = response[17];
    const rf_model_prediction = response[18];
    const binary_result = response[19];

    if (stars === 5){
      five_star ++;
    } else if (stars >= 4.75){
      quarterfive_star ++;
    } else if (stars >= 4.5){
      fourhalf_star ++;
    } else if (stars >= 4.25){
      fourquarter_star ++;
    } else if (stars >= 4){
      four_star ++;
    } else if (stars >= 3){
      three_star ++;
    } else if (stars >= 2){
      two_star ++;
    } else {
      one_star ++;
    };

    function createMarker(color, layer) {
      if (lat){
        L.circle([lat, long],{
          fillOpacity: 1,
          color: color,
          fillColor: color,
          radius: 5
        }).addTo(layer).bindPopup(`<h2>Name: ${name}</h2><hr/><h2>Rating: ${stars}</br>Avg Violations: ${violation_count}</h2><hr/>` );
      }
    }
    
    function createMarker_ml(layer) {
      if (lat){
        L.circle([lat, long],{
          fillOpacity: 1,
          color: color,
          fillColor: color,
          radius: 5
        }).addTo(layer).bindPopup(`<h2>Name: ${name}</h2><hr/><h2>Stars: ${stars}</br>Number of violations: ${violation_count}</h2><hr/>
        <h3>Inspection result: ${result}</br>Random Forest prediction: ${rf_model_prediction}</br>Logistic regression prediction: ${logistic_model_prediction}<hr/>
        <strong>Violations by type</strong>
        </br>Management: ${management_violations}
        </br>Hygiene: ${hygienic_violations}
        </br>Food prep: ${food_prep_violations}
        </br>Pests/rodents: ${pests_rodents_violtations}
        </br>Utensils: ${utensils_equipment_violations}
        </br>Facility: ${phyisical_facilities_violations}
        </br>Compliance: ${compliance_violations} </h3>`);
      }
    }

// there will be different samples that were used in the train/test groups for each prediction model
    // random forest classifier marker creation
    let color = '#73FA0A';

    // both got the prediction right (green)
    if (binary_result < 3 && rf_model_prediction == binary_result && logistic_model_prediction == binary_result){
      color = '#7fff00';
      createMarker_ml(machineLearningLayer);
    }
    // only the random forest predicted correctly (pink)
    else if (binary_result < 3 && rf_model_prediction == binary_result && logistic_model_prediction != binary_result){
      color = '#FF69B4';
      createMarker_ml(machineLearningLayer);
    }
    // only the logistic model predicted correctly (blue)
    else if (binary_result < 3 && logistic_model_prediction == binary_result && rf_model_prediction != binary_result){
      color = '#00ffff';
      createMarker_ml(machineLearningLayer);
    }
    // neither predicted it correctly (red)
    else if (binary_result < 3 && logistic_model_prediction != binary_result && rf_model_prediction != binary_result){
      color = '#ff0000';
      createMarker_ml(machineLearningLayer);
    }
    
    color = '#73FA0A';

    if (violation_count > 15){
      fifteen_violations ++;
      color = '#FC4602';
      createMarker(color, veryHighViolationsLayer);
    }
    else if (violation_count > 10){
      ten_violations ++;
      color = '#e05702';
      createMarker(color, highViolationsLayer);
    }
    else if (violation_count > 5){
      five_violations ++;
      color = '#e07102';
      createMarker(color, avgViolationsLayer);
    }
    else if (violation_count > 2.5){
      twohalf_violations ++;
      color = '#E6B51C';
      createMarker(color,lowViolationsLayer);
    }
    else if (violation_count > 0){
      one_violation ++;
      color = '#B5FA0A';
      createMarker(color,veryLowViolationsLayer);
    }
    else{
      zero_violations ++;
      createMarker(color,noViolationsLayer);
    };

    // if (star_array.length == 100){
    //   return;
    // } else {
    star_array.push(stars);
    violation_array.push(violation_count);
    // };
    
  });
  
  // console.log(fifteen_violations, ten_violations, five_violations, twohalf_violations, one_violation, zero_violations);
  // console.log(five_star,quarterfive_star,fourhalf_star,fourquarter_star,four_star,three_star,two_star,one_star);
  // console.log(star_array);
  // console.log(violation_array);



  // create objects to hold the maps
  const baseMaps = {
    dark: darkmap,
    streets: streetmap,
    satellite: satellitemap
  };

  const overlayMaps = {
    Very_high: veryHighViolationsLayer,
    High: highViolationsLayer,
    Avg: avgViolationsLayer,
    Low: lowViolationsLayer,
    Minimal: veryLowViolationsLayer,
    None: noViolationsLayer,
    Machine_learning: machineLearningLayer
  };

  const myMap = L.map("map", {
    center: [41.8881, -87.6298],
    zoom: 13,
    // default when you load the page
    layers: [darkmap, machineLearningLayer]
  });

  // create a legend/control panel
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  new Chartist.Bar('#bar', {
    labels: ["5 Stars","4.75 to 5 Stars","4.5 to 4.75 Stars","4.25 to 4.5 Stars","4 to 4.25 Stars","3 to 4 Stars","2 to 3 Stars","Less Than 2 Stars"],
    series: [[five_star,quarterfive_star,fourhalf_star,fourquarter_star,four_star,three_star,two_star,one_star]]
  }, {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {
      offset: 70
    }
  });

  var chart = new Chartist.Pie('#pie', {
    series: [fifteen_violations, ten_violations, five_violations, twohalf_violations, one_violation, zero_violations],
    labels: ["15 or More Violations","10 to 15 Violations","5 to 10 Violations","2.5 to 5 Violations","1 to 2.5 Violations","0 Violations"]
  }, {
    donut: true,
    showLabel: true
  });


  
  // Credit to Chartist.js Documentation for Code to Animate the Donut Chart

  chart.on('draw', function(data) {
    if(data.type === 'slice') {
      var pathLength = data.element._node.getTotalLength();
  
      data.element.attr({
        'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
      });
  
      var animationDefinition = {
        'stroke-dashoffset': {
          id: 'anim' + data.index,
          dur: 1500,
          from: -pathLength + 'px',
          to:  '0px',
          easing: Chartist.Svg.Easing.easeOutQuint,
          fill: 'freeze'
        }
      };
  
      if(data.index !== 0) {
        animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
      }
  
      data.element.attr({
        'stroke-dashoffset': -pathLength + 'px'
      });
  
      data.element.animate(animationDefinition, false);
    }
  });
  
  chart.on('created', function() {
    if(window.__anim21278907124) {
      clearTimeout(window.__anim21278907124);
      window.__anim21278907124 = null;
    }
    window.__anim21278907124 = setTimeout(chart.update.bind(chart), 10000);
  });
  
  new Chartist.Line('#scatter', {
    series: [violation_array],
    labels: star_array
  }, {
    showLine: false,
    axisX: {
      labelInterpolationFnc: function(value, index) {
        return index % 2000 === 0 ? value + " Stars" : null;
      }
    }
  });

}).catch((error) => {
  console.log(error)
});
