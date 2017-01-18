
// ---------------
// variables
// ---------------

var googleMap;
var heatMap;

var existingLocations;

var requestData;

var totalWlanHandle;
var totalMeasurementsHandle;

var totalWlanNetworks;
var totalMeasurements;

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
        data: []
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

    // initialise existing locations
    existingLocations = [];
    totalWlanNetworks = 0;
    totalMeasurements = 0;
    totalWlanHandle = $('#count-wlan-networks');
    totalMeasurementsHandle = $('#count-measurements');

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
            if (existingLocations.indexOf(data[i].latitude + '-' + data[i].longitude) == -1)
            {
                heatMap.data.push({
                    location: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                    weight: data[i].amount
                });

                totalWlanNetworks += parseInt(data[i].amount);
                totalWlanHandle.text(totalWlanNetworks);

                totalMeasurements++;
                totalMeasurementsHandle.text(totalMeasurements);

                existingLocations.push(data[i].latitude + '-' + data[i].longitude);
            }
        }

    })
    .fail(function (error)
    {
        console.log(error);
    });

}