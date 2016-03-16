
var map;
var infowindow;
var currentPos
/*Default current position*/
currentPos = {lat: 56.605099, lng: 13.003036};

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 15
    });
    directionsDisplay.setMap(map);
    
    infowindow = new google.maps.InfoWindow();
    //var infoWindow = new google.maps.InfoWindow({map: map});
    var service = new google.maps.places.PlacesService(map);
  
    
    if (navigator.geolocation) {    
        console.log("geolocation supported");
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.log("geolocation not supported");
    }
    
    
    /*Vid klickning på kartan*/
    map.addListener('click', function(event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        
        var pointed = {lat: lat, lng: lng};
        console.log(pointed);
        calculateAndDisplayRoute(directionsService, directionsDisplay, currentPos, pointed);
        /*
        service.nearbySearch({
            location: pointed,
            radius: 500,
            type: ['bus_station']
          }, callback);
        */
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    createMarker(results[0]);
        
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name+" lel");
    infowindow.open(map, this);
  });
}

//navigator.geolocation.getCurrentPosition(showPosition);

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude + 
    "Longitude: " + position.coords.longitude); 
}
function setPosition(position) {
    currentPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    
    map.setCenter(currentPos);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
  directionsService.route({
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.TRANSIT
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}