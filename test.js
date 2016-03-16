if (navigator.geolocation) { //Checks if browser supports geolocation
    navigator.geolocation.getCurrentPosition(function (position) {

        var malmo = {
            lat: 55.605099,
            lng: 13.003036
        };
        var malmo2 = {
            lat: 55.6,
            lng: 13.0
        }

        var long = position.coords.longitude;
        var lat = position.coords.latitude;

        var coords = new google.maps.LatLng(lat, long);

        
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 10,
                center: malmo
            });
            directionsDisplay.setMap(map);

            var onclickHandler = function () {
                calculateAndDisplayRoute(directionsService, directionsDisplay);
            };
            console.log(coords);
            document.getElementById('map').addEventListener('click', onclickHandler)
        

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {
            directionsService.route({
                origin: coords,
                destination: malmo2,
                travelMode: google.maps.TravelMode.TRANSIT
            }, function (response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }
    });
}
