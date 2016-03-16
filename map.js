var map;
var infowindow;
var currentPos
    /*Default current position*/
currentPos = {
    lat: 56.605099,
    lng: 13.003036
};

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 8
    });
    directionsDisplay.setMap(map);
    
    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);

    /* Sätt nuvarande position till */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.log("Geolocation not supported");
    }
    
    /* Vid manuell input */
    document.getElementById("go-button").addEventListener("click", function(){
        var destination = document.getElementById("destination-field").value;
        console.log(destination);
        calculateAndDisplayRoute(directionsService, directionsDisplay, 
                                 currentPos, destination);
        
    });
    
    
    /* Vid klickning på kartan */
    map.addListener('click', function (event) {
        var destination = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        console.log(destination);
        calculateAndDisplayRoute(directionsService, directionsDisplay, 
                                 currentPos, destination);
        
    });
}

function createSimpleMarker(place) {
    var marker = new google.maps.Marker({
        position: place,
        map: map,
        title: 'testtitel'
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent("testmeddelande");
        infowindow.open(map, this);
    });
}

function setPosition(position) {
    /* Ändrar currentPos till nuvarande geolocation position
     * och centrerar kartan på positionen*/
    currentPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    map.setCenter(currentPos);
    map.setZoom(15);
    createSimpleMarker(currentPos);
    
    var infowindow3 = new google.maps.InfoWindow({
        content: "lel"
      });
    infowindow3.open(map, currentPos);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
    /* Tar emot två positioner, origin och destination och räknar ut bästa
     * resväg med kollektivtrafik och visar upp resvägen på karta*/
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            document.getElementById('errorspace').innerHTML = "";
            directionsDisplay.setDirections(response);
        } else {
            console.log("hej");
            
            document.getElementById('errorspace').innerHTML = 'Directions request failed due to ' + status; 
        }
    });
}