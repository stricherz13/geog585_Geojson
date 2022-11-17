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

    var gardenLayer;
    var pantryLayer;

    var selection;
    var selectedLayer;

    // define the styles for the garden layer (unselected and selected)
    function gardenStyle(feature) {
        return {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
    }

    function gardenSelectedStyle(feature) {
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
    function gardenOnEachFeature(feature, layer){
        layer.on({
            click: function(e) {
                if (selection) {
                    resetStyles();
                }

                e.target.setStyle(gardenSelectedStyle());
                selection = e.target;
                selectedLayer = gardenLayer;

                // Insert some HTML with the feature name
                buildSummaryLabel(feature);

                L.DomEvent.stopPropagation(e); // stop click event from being propagated further
            }
        });
    }

    // add the gardens GeoJSON layer using the gardensData variable from gardens.js
    var gardenLayer = new L.geoJSON(propertiesData,{
        style: gardenStyle,
        onEachFeature: gardenOnEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, gardenStyle)
        }
    });



    gardenLayer.addTo(map);

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
        if (selectedLayer === pantryLayer) selection.setIcon(pantriesIcon);
        else if (selectedLayer === gardenLayer) selectedLayer.resetStyle(selection);
    }

    // function to build the HTML for the summary label using the selected feature's "name" property
    function buildSummaryLabel(currentFeature){
        var featureName = currentFeature.properties.handle || "Unnamed feature";
        document.getElementById('summaryLabel').innerHTML = '<p style="font-size:18px"><b>' + featureName + '</b></p>';
    }

}

