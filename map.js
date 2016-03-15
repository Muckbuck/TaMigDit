function initMap() {
    var myLatlng = {lat: 55.605099, lng: 13.003036};
    
    var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatlng,
    zoom: 10,
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'on' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
    
    marker.addListener('click', function() {
        map.setZoom(8);
        map.setCenter(marker.getPosition());
    });
}
