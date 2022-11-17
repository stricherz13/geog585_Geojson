let map;

function init() {
    // create map and set center and zoom level
    map = new L.map('mapid');
    map.setView([38.627,-90.22],12);

    // create and add the tile layer
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    tiles.addTo(map);

    var propertiesLayer;
    var pantryLayer;

    var selection;
    var selectedLayer;

    // define the styles for the garden layer (unselected and selected)
    function propertiesStyle(feature) {
        return {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    function propertiesSelectedStyle(feature) {
        return {
            radius: 5,
            fillColor: "#00FFFB",
            color: '#0000FF',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    // handle click events on garden features
    function propertiesOnEachFeature(feature, layer){
        layer.on({
            click: function(e) {
                if (selection) {
                    resetStyles();
                }

                e.target.setStyle(propertiesSelectedStyle());
                selection = e.target;
                selectedLayer = propertiesLayer;

                // Insert some HTML with the feature name
                buildTable(feature);

                L.DomEvent.stopPropagation(e); // stop click event from being propagated further
            }
        });
    }

    // add the gardens GeoJSON layer using the gardensData variable from gardens.js
    var propertiesLayer = new L.geoJSON(propertiesData,{
        style: propertiesStyle,
        onEachFeature: propertiesOnEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, propertiesStyle)
        }
    });



    propertiesLayer.addTo(map);

    // handle clicks on the map that didn't hit a feature
    map.addEventListener('click', function(e) {
        if (selection) {
            resetStyles();
            selection = null;
            document.getElementById('summaryLabel').innerHTML = '<p>Click a property on the map to get more information.</p>';
        }
    });

    // function to set the old selected feature back to its original symbol. Used when the map or a feature is clicked.
    function resetStyles(){
        if (selectedLayer === propertiesLayer) selectedLayer.resetStyle(selection);
    }

    //function to build the HTML table with the attributes from the selected property
    function buildTable(currentFeature){
        let handle = currentFeature.properties.handle
        document.getElementById("handle").innerHTML = '<p>' + handle + '</p>';
        let address = currentFeature.properties.siteaddr
        document.getElementById("address").innerHTML = '<p>' + address + '</p>';
        let total = currentFeature.properties.user_total
        document.getElementById("total").innerHTML = '<p>' + `$${total}` + '</p>';
        let neighborhood = currentFeature.properties.neighborho
        document.getElementById("neighborhood").innerHTML = '<p>' + neighborhood + '</p>';
        let landuse = currentFeature.properties.landuse
        document.getElementById("landuse").innerHTML = '<p>' + landuse + '</p>';
        let zoning = currentFeature.properties.zoning
        document.getElementById("zoning").innerHTML = '<p>' + zoning + '</p>';
    }
}

