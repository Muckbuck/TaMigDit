
var map;
var infowindow;
var currentPos
currentPos = {lat: 56.605099, lng: 13.003036};

function initMap() {
    
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    //var infoWindow = new google.maps.InfoWindow({map: map});
    var service = new google.maps.places.PlacesService(map);
  
    
    if (navigator.geolocation) {    
        console.log("geolocation supported");
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.log("geolocation not supported");
    }
    
    
    map.addListener('click', function(event) {
        var lat = event.latLng.lat();
        
        var lng = event.latLng.lng();
        
        var pointed = {lat: lat, lng: lng};
        console.log(pointed);
        service.nearbySearch({
            location: pointed,
            radius: 500,
            type: ['bus_station']
          }, callback);
        
    });
}

function callback(results, status) {
  console.log("kek");
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    createMarker(results[0]);
    /*
    for (var i = 0; i < 1; i++) {
      createMarker(results[i]);
    }*/
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
