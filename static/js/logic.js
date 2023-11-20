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
    let eq_markers = L.geoJson(response,{
        pointToLayer: function (geoJsonPoint, latlng){
            return L.circle(latlng);
        }
    }).bindPopup(function (layer) {
        return layer.features.properties.mag;
    });
    createMap(eq_markers);
}



d3.json(url).then(eqMarkers);