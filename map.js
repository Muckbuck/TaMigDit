/*Map functionality*/
var map;
var infowindow;
var currentPos;

currentPos = {
    lat: 56.605099,
    lng: 13.003036
};
/* Ändra tidsväljaren till nuvarande tid */
var d = new Date();
var currentHour = d.getHours();
if (currentHour < 10) {
    currentHour = "0"+currentHour;
}
var currentMinute = d.getMinutes();
if (currentMinute < 10) {
    currentMinute = "0"+currentMinute;
}

document.getElementById("timeInput").value = currentHour+":"+currentMinute;

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

    /* Sätt nuvarande position till användarens geolocation */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.log("Geolocation not supported");
    }
    
    /* Vid manuell input */
    document.getElementById("go-button").addEventListener("click", function(){
        var destination = document.getElementById("destination-field").value;
        if (document.getElementById("departure").checked == true) {
            var departure = new Date(d.getFullYear(),d.getMonth(),d.getDate(),
                                     document.getElementById("timeInput").value.substring(0,2),
                                     document.getElementById("timeInput").value.substring(3,5),
                                     00,00);
            var arrival = new Date(0);
        } else {
            var arrival = new Date(d.getFullYear(),d.getMonth(),d.getDate(),
                                     document.getElementById("timeInput").value.substring(0,2),
                                     document.getElementById("timeInput").value.substring(3,5),
                                     00,00);
            var departure = new Date(0);
        }
        calculateAndDisplayRoute(directionsService, directionsDisplay, 
                                 currentPos, destination,
                                 departure, arrival);
        
    });
    /*************************/
    
    /* Vid klickning på kartan */
    map.addListener('click', function (event) {
        if (document.getElementById("departure").checked == true) {
            var departure = new Date(d.getFullYear(),d.getMonth(),d.getDate(),
                                     document.getElementById("timeInput").value.substring(0,2),
                                     document.getElementById("timeInput").value.substring(3,5),
                                     00,00);
            var arrival = new Date(0);
        } else {
            var arrival = new Date(d.getFullYear(),d.getMonth(),d.getDate(),
                                     document.getElementById("timeInput").value.substring(0,2),
                                     document.getElementById("timeInput").value.substring(3,5),
                                     00,00);
            var departure = new Date(0);
        }
        
        var destination = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        console.log(destination);
        calculateAndDisplayRoute(directionsService, directionsDisplay, 
                                 currentPos, destination,
                                 departure, arrival);
        
    });
    /***********************/
}

function createSimpleMarker(place) {
    /* Skapar en markör på position place */
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
        content: "Din position"
      });
    infowindow3.open(map, currentPos);
    
    console.log(codeLatLng(currentPos.lat, currentPos.lng));
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination, departure, arrival) {
    /* Tar emot två positioner, origin och destination och räknar ut bästa
     * resväg med kollektivtrafik och visar upp resvägen på karta*/
    console.log(departure);
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
            departureTime: departure,
            arrivalTime: arrival
          },
    }, function (response, status) {
        console.log(response);
        if (status === google.maps.DirectionsStatus.OK) {
            document.getElementById('errorspace').innerHTML = "";
            directionsDisplay.setDirections(response);
            document.getElementById("destination-field").value = 
                response.routes[0].legs[0].end_address;
        } else {
            console.log("error");
            if (status == "ZERO_RESULTS") {
                console.log("hej");
                document.getElementById('errorspace').innerHTML = "Kunde inte hitta någon väg till vald destination";
            } else {
                document.getElementById('errorspace').innerHTML = 'Directions request failed due to ' + status; 
            }
        }
    });
}


/*****Geocoder**********/
var geocoder;

function initialize() {
  geocoder = new google.maps.Geocoder();
}

function codeLatLng(lat, lng) {
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latlng
  }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        console.log(results[1]);
      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
/*******************************/