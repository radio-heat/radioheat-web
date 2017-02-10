(function()
{

    // -----------------------
    // variables
    // -----------------------

    // global variable of this api
    var radioHeatAPI = window.radioheat || (window.radioheat = {});

    var baseUrl = 'http://82.165.75.129:8080/';

    // REST-object
    var http = new XMLHttpRequest();

    // -----------------------
    // functions
    // -----------------------

    radioHeatAPI.listFrequencies = function(frequencyBand)
    {
        // use promises
        return new Promise(function(success, fail)
        {
            // target url and used http method
            http.open('GET', baseUrl + 'frequency-band/list/' + frequencyBand, true);

            // after the request
            http.onload = function()
            {
                if (http.status == 200)
                    success(JSON.parse(http.response));
                else
                    fail(JSON.parse(http.response));
            };

            // if an error occurs
            http.onerror = function()
            {
                fail('network error');
            };

            // begin request
            http.send();
        });
    };

    radioHeatAPI.listFrequencies = function(location)
    {
        // use promises
        return new Promise(function (success, fail) {
            // target url and used http method
            http.open('POST', baseUrl + 'frequency-band/list/', true);

            // after the request
            http.onload = function()
            {
                if (http.status == 200)
                    success(JSON.parse(http.response));
                else
                    fail(JSON.parse(http.response));
            };

            // if an error occurs
            http.onerror = function () {
                fail('network error');
            };

            // begin request
            http.send(JSON.stringify(location));
        });
    };

})();