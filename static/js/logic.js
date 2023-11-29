const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data
d3.json(url).then((data) => {
    console.log(data.length);
});

// Function to create the map
function createMap(eq){

    // Create the satellite tile
    let sat = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    // baseMaps object
    let baseMaps = {
        "Satellite" : sat
    };

    // Create an overlay object
    let overlayMaps = {
        "Earthquakes" : eq
    };

    // Create the map
    let myMap = L.map("map",{
        center: [40.016602, -102.053112],
        zoom:3,
        layers:[sat,eq]
    });

    // Create a layer control
    L.control.layers(baseMaps, overlayMaps,{
        collapsed:false
    }).addTo(myMap);

}

//createMap();

// Function to create the earthquake markers
function eqMarkers(response){

    // Function to determine marker color
    function circleColor(depth){
        if (depth < 10){
            return "#a3f601"
        } else if (depth < 30){
            return "#dcf400"
        } else if (depth < 50){
            return "#f7db12"
        } else if (depth < 70){
            return "#fdb72a"
        } else if (depth < 90){
            return "#fca35d"
        } else {return "#ff5f64"}
    };

    // Function to determine marker size
    function circleSize(mag){
        return mag*5;
    }

    // Function to bindpopup
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h4>EQ Details</h4><hr/>\
        <small><b>Location:</b> ${feature.properties.place}<br/>\
        <b>Lat:</b> ${feature.geometry.coordinates[1]}<br/>\
        <b>Long:</b> ${feature.geometry.coordinates[0]}<br/>\
        <b>Depth:</b> ${feature.geometry.coordinates[2]}<br/>\
        <b>Magnitude:</b> ${feature.properties.mag}<br/>\
        <a target="_blank" href=${feature.properties.url}>USGS Eventpage</a></small>`
        )};

    // Function to create Circle
    function createMarker(geoJsonPoint, latlng){
        //console.log(geoJsonPoint);
        return L.circleMarker(latlng, {
            radius : circleSize(geoJsonPoint.properties.mag),
            weight: 1,
            color: "gray",
            fillColor: circleColor(geoJsonPoint.geometry.coordinates[2]),
            fillOpacity: 0.9
        });
    };

    let eq_markers = L.geoJson(response,{
        pointToLayer : createMarker,
        onEachFeature : onEachFeature
        });

    createMap(eq_markers);
}



d3.json(url).then(eqMarkers);