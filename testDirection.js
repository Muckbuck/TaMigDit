function initialize() {
     var mapOptions = {
       center: currentPos,//put your initial position values
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     var map = new google.maps.Map(document.getElementById("map"),
         mapOptions);
   }
   // get drections
directions: function(method) {

// set directions method
method = google.maps.DirectionsTravelMode.WALKING;
if (method === 'public')
    method = google.maps.DirectionsTravelMode.TRANSIT;

// current position
var currentPos = new google.maps.LatLng(app.positionCords.latitude, app.positionCords.longitude);

// set the directions options
var request = {
    origin: currentPos,
    destination: app.venueCords,
    travelMode: method
};

// get the directions
app.directionsService.route(request, function (response, status) {

    if (status == google.maps.DirectionsStatus.OK) {

        // set up directions on the map
        app.directionsDisplay.setMap(document.getElementById('map'));
        app.directionsDisplay.setPanel(document.getElementById('directionsPanel'));
        app.directionsDisplay.setDirections(response);

    } else {
        app.messageBox.alert(app.alertTitle, app.noDirectionsMsg, function(button) { console.warn('alert', [this, arguments]); });
    }

});

}
