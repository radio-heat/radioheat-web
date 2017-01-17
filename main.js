
// ---------------
// variables
// ---------------

var googleMap;
var heatMap;

var requestData;

// ---------------
// functionality
// ---------------

function initializeGoogleMaps()
{
    // initialise the map
    googleMap = new google.maps.Map(document.getElementById('map-element'), {
        center: {               // HfTL
            lat: 51.313186,
            lng: 12.375728
        },
        zoom: 18
    });

    // Initialise Heat Map
    heatMap = new google.maps.visualization.HeatmapLayer({
        data: [],
        dissipating: true,
        maxIntensity: 99
    });

    heatMap.setMap(googleMap);
    
    // Set request data
    requestData = {
        url: 'http://82.165.75.129:8080/list',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        crossDomain: true
    };

    // When the map is dragged by the mouse, reload the data
    googleMap.addListener('bounds_changed', reloadData);
}

function reloadData()
{
    // Get the center location of the map
    var location = {
        latitude: parseFloat(googleMap.getCenter().lat().toFixed(6)),
        longitude: parseFloat(googleMap.getCenter().lng().toFixed(6))
    };

    // Set current location
    requestData.data = JSON.stringify(location);

    // Begin request
    $.ajax(requestData)
    .done(function (data)
    {
        var i;

        for (i = 0; i < data.length; i++)
        {
            heatMap.data.push({
                location: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                weight: 100 - Math.abs(data[i].strength)
            });
        }

    })
    .fail(function (error)
    {
        console.log(error);
    });

}