const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data
d3.json(url).then((data) => {
    console.log(data.length);
});

// Function to create the map
function createMap(eq){

    // Create the satellite tile
    let sat = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 12,
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

    // Create a legend control
    let legend = L.control({
        position:"bottomright"
    });

    // Add a div class to legend control
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "legend");
        return div;
    };

    // Add legend control to map
    legend.addTo(myMap);

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
        layer.bindPopup(`<h4>Earthquake Details</h4><hr/>\
        <small><b>Date/Time:</b> ${new Date(feature.properties.time).toUTCString()}<br/>\
        <b>Location:</b> ${feature.properties.place}<br/>\
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
    createLegend();
}

// Function to create legend
function createLegend(){
    document.querySelector(".legend").innerHTML = [
        "<h4>Legend</h4><hr/>",
        "<div class='legoption'><div class='box' style='background-color:#a3f601;'></div> -10-10</div>",
        "<div class='legoption'><div class='box' style='background-color:#dcf400;'></div> 10-30</div>",
        "<div class='legoption'><div class='box' style='background-color:#f7db12;'></div> 30-50</div>",
        "<div class='legoption'><div class='box' style='background-color:#fdb72a;'></div> 50-70</div>",
        "<div class='legoption'><div class='box' style='background-color:#fca35d;'></div> 70-90</div>",
        "<div class='legoption'><div class='box' style='background-color:#ff5f64;'></div> 90+</div>",
    ].join("");
}

d3.json(url).then(eqMarkers);