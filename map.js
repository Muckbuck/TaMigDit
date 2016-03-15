
var map;
var infowindow;

function initMap() {
  var malmo = {lat: 55.605099, lng: 13.003036};

  map = new google.maps.Map(document.getElementById('map'), {
    center: malmo,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  
    
    
    map.addListener('click', function(event) {
        var lat = event.latLng.lat();
        
        var lng = event.latLng.lng();
        
        var current = {lat: lat, lng: lng};
        console.log(current);
        service.nearbySearch({
            location: current,
            radius: 500,
            type: ['bus_station']
          }, callback);
        
    });
}

function callback(results, status) {
  console.log("kek");
    if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}