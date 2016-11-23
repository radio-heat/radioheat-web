
var mapElement;

function initMap()
{
    mapElement = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 51.3417825, lng: 12.3936349 },
        zoom: 11
    });
}