// Store our API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
// Pull in the JSON file
d3.json("JSON/PB2002_boundaries.json").then(function (data2) {
    tectonicPlates = L.geoJSON(data2.features, {
        color: "red"
    })
});
  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}<br>Magnitude: ${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          let radius = feature.properties.mag * 5;
          if (feature.geometry.coordinates[2] > 90) {
              fillcolor = '#a6f6b9';
          }
          else if (feature.geometry.coordinates[2] >= 70) {
              fillcolor = '#a6f6da';
          }
          else if (feature.geometry.coordinates[2] >= 50) {
              fillcolor = '#ff9400';
          }
          else if (feature.geometry.coordinates[2] >= 30) {
              fillcolor = '#a6b3f6';
          }
          else if (feature.geometry.coordinates[2] >= 10) {
              fillcolor = '#f6a6eb';
          }
          else fillcolor = '#f6a6a6';

          return L.circleMarker(latlng, {
              radius: radius,
              color: 'black',
              fillColor: fillcolor,
              fillOpacity: 1,
              weight: 1
          });
      }

  });
      
      // Send our earthquakes layer to the createMap function/
  createMap(earthquakes, tectonicPlates);
}

function createMap(earthquakes, tectonicPlates) {
  // Create the base layers.
let satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    maxZoom: 20,
    id: "mapbox.satellite",
    accessToken: API_KEY,
    attribution: '?? <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ?? <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
});

let grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 20,
    id: "light-v10",
    accessToken: API_KEY,
    attribution: '?? <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ?? <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
});

let outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 20,
    id: "outdoors-v11",
    accessToken: API_KEY,
    attribution: '?? <a href="https://www.mapbox.com/about/maps/">Mapbox</a> ?? <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
});

// Create a baseMaps object.
  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": grayscale,
    "Outdoors": outdoors
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite, earthquakes, tectonicPlates]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//Create the legend
let legend = L.control({
  position: "bottomright"
});

// Add legend details
legend.onAdd = function () {
  let div = L.DomUtil.create("div", "legend");

  let grades = [-10, 10, 30, 50, 70, 90];
  let colors = [
      "#f6a6a6",
      "#f6a6eb",
      "#a6b3f6",
      "#ff9400",
      "#a6f6da",
      "#a6f6b9"
  ];

  // Looping through
  for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
          "<i style= 'background: " + colors[i] + "'></i> " +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</br>" : "+");
  }
  return div;
};

// Add the legend to the map
legend.addTo(myMap);

}