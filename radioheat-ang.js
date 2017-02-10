(function()
{

    // urls for the app server
    var appServerAdresses = {
        listFrequencyBand: 'http://82.165.75.129:8080/frequency-band/list/',
        listMeasurements: 'http://82.165.75.129:8080/measurement/list'
    };

    // get angularjs-app module
    var app = angular.module('radioheat-web', []);

    // register the controller of this app
    app.controller('RadioheatWebController', RadioheatWebController);

    // register necessary angularjs-dependency-injection types
    RadioheatWebController.$inject = ['$scope', '$http'];

    // define app-controller
    function RadioheatWebController($scope, $http)
    {
        // Google Map
        var googleMap, heatmap, existingLocations = [];

        // Statistics
        $scope.totalWlanNetworks = 0;
        $scope.totalMeasurements = 0;

        // Existing frequency bands
        $scope.frequencyBands = ['All', 2.4, 5];
        $scope.selectedFrequencyBand = 'All';

        // Existing frequencies
        $scope.frequencies = ['All'];
        $scope.selectedFrequency = $scope.frequencies[0];

        // UI
        $scope.isFrequencyDisabled = true;
        $scope.isLoading = true;

        // initialise

        $scope.initialise = function()
        {
            // initialise google map
            googleMap = new google.maps.Map(document.getElementById('map-element'), {
                center: {               // HfTL
                    lat: 51.313186,
                    lng: 12.375728
                },
                zoom: 18
            });

            // initialise heatmap
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: []
            });

            // link heatmap with google map
            heatmap.setMap(googleMap);

            // reload measurement results, when map changes its focus
            googleMap.addListener('bounds_changed', requestMeasurements);
        };

        // when the frequency band is changed
        $scope.changeFrequencyBand = function()
        {
            // clean the map
            cleanMap();

            // request frequencies for selected frequency band
            if ($scope.selectedFrequencyBand == 'All')
                $scope.selectedFrequency = 'All';
            else
                requestFrequencies($scope.selectedFrequencyBand);

            // enable / disable of selected frequency depends on selected frequency band
            $scope.isFrequencyDisabled = ($scope.selectedFrequencyBand == 'All');
            requestMeasurements();
        };

        // when the frequency is changed
        $scope.changeFrequency = function()
        {
            cleanMap();
            requestMeasurements();
        };

        // Cleaning

        function cleanMap()
        {
            existingLocations = [];

            heatmap.setMap(null);

            $scope.totalMeasurements = 0;
            $scope.totalWlanNetworks = 0;

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: []
            });

            // link heatmap with google map
            heatmap.setMap(googleMap);
        }

        // Network requests

        // Request the existing frequencies of a given frequency band
        function requestFrequencies(frequencyBand)
        {
            $http({
                method: 'GET',
                url: appServerAdresses.listFrequencyBand + frequencyBand
            })
            .then(function (response) {
                $scope.frequencies = response.data;
                $scope.frequencies.unshift('All');
                $scope.selectedFrequency = $scope.frequencies[0];
            },
            function (error) {
                console.log(error);
            });
        }

        // Request the measurements of a given location
        function requestMeasurements()
        {
            // get current position
            var serviceArguments = {
                latitude: parseFloat(googleMap.getCenter().lat().toFixed(6)),
                longitude: parseFloat(googleMap.getCenter().lng().toFixed(6))
            };

            if ($scope.selectedFrequencyBand != 'All')
                if ($scope.selectedFrequency == 'All')
                    serviceArguments.frequency = $scope.selectedFrequencyBand;
                else
                    serviceArguments.frequency = $scope.selectedFrequency;

            $http({
                method: 'POST',
                url: appServerAdresses.listMeasurements,
                data: serviceArguments
            })
            .then(function (response) {

                var i, data = response.data;

                for (i = 0; i < data.length; i++) {
                    if (existingLocations.indexOf(data[i].latitude + '-' + data[i].longitude) == -1) {
                        heatmap.data.push({
                            location: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                            weight: data[i].amount
                        });

                        $scope.totalWlanNetworks += parseInt(data[i].amount);
                        $scope.totalMeasurements++;

                        existingLocations.push(data[i].latitude + '-' + data[i].longitude);
                    }
                }
            },
            function (error) {
                console.log(error);
            });
        }

    }

})();

function init()
{
    var scope = angular.element(document.body).scope();
    scope.$apply(function()
    {
        scope.isLoading = false;
        scope.initialise();
    });
}

// after google maps lib has been downloaded, start to initialise the app
$('#googleScript').ready(function()
{
    setTimeout(init, 1500);
});