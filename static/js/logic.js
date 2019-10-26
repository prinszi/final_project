
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
    const lat = response[2];
    const long = response[3];
    const name = response[0];
    const stars = response[9];
    const avg_violations = response[11];
    const times_inspected = response[12];

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


    function createMarker(lat,long,name,stars,avg_violations,color,layer) {
      if (lat){
        L.circle([lat, long],{
          fillOpacity: 1,
          color: color,
          fillColor: color,
          radius: 5
        }).addTo(layer).bindPopup(`<h2>Name: ${name}</h2><hr/><h2>Rating: ${stars}</br>Avg Violations: ${avg_violations}</br>Times Inspected: ${times_inspected}</h2>`);
      }
    }

    let color = '#73FA0A';

    if (avg_violations > 15){
      fifteen_violations ++;
      color = '#FC4602';
      createMarker(lat,long,name,stars,avg_violations,color,veryHighViolationsLayer);
    }
    else if (avg_violations > 10){
      ten_violations ++;
      color = '#e05702';
      createMarker(lat,long,name,stars,avg_violations,color,highViolationsLayer);
    }
    else if (avg_violations > 5){
      five_violations ++;
      color = '#e07102';
      createMarker(lat,long,name,stars,avg_violations,color,avgViolationsLayer);
    }
    else if (avg_violations > 2.5){
      twohalf_violations ++;
      color = '#E6B51C';
      createMarker(lat,long,name,stars,avg_violations,color,lowViolationsLayer);
    }
    else if (avg_violations > 0){
      one_violation ++;
      color = '#B5FA0A';
      createMarker(lat,long,name,stars,avg_violations,color,veryLowViolationsLayer);
    }
    else{
      zero_violations ++;
      createMarker(lat,long,name,stars,avg_violations,color,noViolationsLayer);
    };

    // if (star_array.length == 100){
    //   return;
    // } else {
    star_array.push(stars);
    violation_array.push(avg_violations);
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
    None: noViolationsLayer
  };

  const myMap = L.map("map", {
    center: [41.8881, -87.6298],
    zoom: 13,
    // default when you load the page
    layers: [darkmap, lowViolationsLayer]
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
