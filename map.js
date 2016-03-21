var map;
var infowindow = null;
var directionsService;
var directionsDisplay;
var currentRouteData = {};
var originFocused = true;
var markers = [];
var geocoder;
/*Default nuvarande position*/
var DefaultPos = {
    lat: 56.605099,
    lng: 13.003036
}
var currentPos = {
    lat: 56.605099
    , lng: 13.003036
};


/* Ändra tid- och datumsväljaren till nuvarande tid */
var d = new Date();
var currentHour = d.getHours();
if (currentHour < 10) {
    currentHour = "0" + currentHour;
}
var currentMinute = d.getMinutes();
if (currentMinute < 10) {
    currentMinute = "0" + currentMinute;
}
document.getElementById("timeInput").value = currentHour + ":" + currentMinute;

var currentMonth = (d.getMonth() + 1);
if (currentMonth < 10) {
    currentMonth = "0" + currentMonth;
}
var currentDay = d.getDate();
if (currentDay < 10) {
    currentDay = "0" + currentDay;
}
var currentYear = (d.getFullYear() + 0);

document.getElementById("dateInput").value =
    currentYear + "-" + currentMonth + "-" + currentDay;

/******************************************/


/* Ser till att båda destinationsfält har samma info */
var firstField = document.getElementById('destination-field');
secondField = document.getElementById('menu-destination-field');

firstField.onkeyup = function () {
    secondField.value = firstField.value;
};
secondField.onkeyup = function () {
    firstField.value = secondField.value;
};
/**************************************************/

window.initMap = function () {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    /* Custom map style */
    var customMapType = new google.maps.StyledMapType([
        {
            "featureType": "transit.station.bus"
            , "stylers": [
                {
                    "hue": "#1900ff"
                }
        ]
      }
    ], {
        name: 'Custom Style'
    });
    var customMapTypeId = 'custom_style';
    /*********************/

    map = new google.maps.Map(document.getElementById('map'), {
        center: DefaultPos,
        zoom: 8,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, customMapTypeId]
        }
    });

    map.mapTypes.set(customMapTypeId, customMapType);
    map.setMapTypeId(customMapTypeId);

    var transitArea = document.getElementById('transit-schedule');
    geocoder = new google.maps.Geocoder;

    var rendererOptions = {
        map: map
        , panel: transitArea
        , hideRouteList: true
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    directionsDisplay.setMap(map);



    /* Autocomplete init */
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(70.4955735409, 29.53125)
        , new google.maps.LatLng(53.2257684358, 2.4609375));

    var options = {
        bounds: defaultBounds
    };

    var destinationField = document.getElementById('destination-field');
    autocomplete = new google.maps.places.Autocomplete(destinationField, options);

    var originField = document.getElementById('origin-field');
    autocomplete = new google.maps.places.Autocomplete(originField, options);

    var menuDestinationField = document.getElementById('menu-destination-field');
    autocomplete = new google.maps.places.Autocomplete(menuDestinationField, options);

    /***************/


    infowindow = new google.maps.InfoWindow();

    var service = new google.maps.places.PlacesService(map);

    /* Sätt nuvarande position till användarens geolocation */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.log("Geolocation not supported");
    }


    /* Vid manuell input */
    document.getElementById("go-button").addEventListener("click", searchByButton);
    document.getElementById("menu-go-button").addEventListener("click", searchByButton);
    $(document).keypress(function (e) {
        if (e.which == 13) {
            searchByButton();
        }
    });

    /*************************/
    $( "#origin-field" ).focus(function() {
        console.log("targeted");
        originFocused = true;
    });
    $( "#destination-field, #menu-destination-field" ).focus(function() {
        console.log("untargeted");
        originFocused = false;
    });
    /* Vid klickning på kartan */
    map.addListener('click', function (event) {
        /* Bästäm origin med klick ifall originrutan markerats */
        if (originFocused) {
            //var selectedPos =  {coords};
            //console.log(selectedPos);
            var selectedPos = {coords: {
                latitude: event.latLng.lat(),
                longitude: event.latLng.lng()
            }};
            console.log(selectedPos);
            setPosition(selectedPos);
        } else {
            /* Annars utför sökning med klickad destination */
        
            if (document.getElementById("departure").checked == true) {
                var departure = getInputTime();
                var arrival = new Date(0);
            } else {
                var arrival = getInputTime();
                var departure = new Date(0);
            }

            var destination = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            //console.log(destination);
            calculateAndDisplayRoute(directionsService, directionsDisplay,
                currentPos, destination,
                departure, arrival);
        }
    });

    /***********************/
    
}



function setPosition(position) {
    /* Ändrar currentPos till nuvarande geolocation position
     * och centrerar kartan på positionen*/
    currentPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    
    reverseGeo(currentPos);
    
                
    map.setCenter(currentPos);
    map.setZoom(15);
    clearMarkers();
    
    createSimpleMarker(currentPos, "Din nuvarande position");

    var infowindow3 = new google.maps.InfoWindow({
        content: "Din position"
    });
    originFocused = false;
}

function calculateAndDisplayRoute(directionsService, directionsDisplay
    , origin, destination, departure, arrival) {
    /* Tar emot två positioner, origin och destination och räknar ut bästa
     * resväg med kollektivtrafik och visar upp resvägen på karta.
     * Kan även ta emot departure och arrival tid och inkludera det i sökningen.*/
    //console.log(departure);
    directionsService.route({
        origin: origin
        , destination: destination
        , travelMode: google.maps.TravelMode.TRANSIT
        , transitOptions: {
            departureTime: departure
            , arrivalTime: arrival
        }
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            /* Vid lyckad sökning: */
            currentRouteData = {
                departure: departure
                , arrival: arrival
                , currentPos: currentPos
                , destination: destination
            };


            console.log(response.routes[0].legs[0]);
            
            document.getElementById("destination-field").value =
                response.routes[0].legs[0].end_address;
            document.getElementById("menu-destination-field").value =
                response.routes[0].legs[0].end_address;


            hideError();
            directionsDisplay.setDirections(response);


            if (infowindow) {
                infowindow.close();
            }

            var steps = response.routes[0].legs[0].steps;
            var lineName;
            for (i = 0; i < steps.length; i++) {
                if (steps[i].travel_mode == "TRANSIT") {
                    var lineName;
                    if (steps[i].transit.line.short_name) {
                        lineName = steps[i].transit.line.short_name;
                    } else if (steps[i].transit.line.name) {
                        lineName = steps[i].transit.line.name;

                    }

                    stopCoords = {
                        lat: steps[i].lat_lngs[0].lat(),
                        lng: steps[i].lat_lngs[0].lng()
                    }
                        //console.log(stopCoords);
                        //createSimpleMarker(stopCoords, "hej");


                    setBusInfoWindow(stopCoords, "<div id='iw-container'> <div class='iw-header'>" +
                                    steps[i].transit.line.vehicle.name + " <b>" +
                                    lineName + "</b>, Riktning: " + steps[i].transit.headsign +
                                    "<p><b></div>" + steps[i].transit.departure_time.text + ",</b> Avresa från: " +
                                    steps[i].transit.departure_stop.name + "</p><p><b>" +
                                    steps[i].transit.arrival_time.text + ",</b> Ankomst: " +
                                    steps[i].transit.arrival_stop.name + "</p>" + "</div>"
                    );
                    
                }
                    
        }

        //logGoogleTripData(response);


        } else {
            console.log(status);
            if (status == "ZERO_RESULTS") {
                //document.getElementById('errorspace').innerHTML = "Kunde inte hitta någon väg till vald destination";
                displayError("Kunde inte hitta någon väg till vald destination");
            } else {
                displayError('Directions request failed due to ' + status);
            }
        }
    });
}

function createSimpleMarker(place, message) {
    /* Skapar en markör på position place */
    
    marker = new google.maps.Marker({
        position: place,
        map: map,
        title: message
    });
    google.maps.event.addListener(marker, 'click', function () {

        infowindow.setContent(message);
        infowindow.open(map, this);
    });
    markers.push(marker);
}
function clearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}



function setBusInfoWindow (place, message) {
    infowindow = new google.maps.InfoWindow();

    infowindow.setOptions({
        content: message
        , position: place
    , });
    infowindow.open(map);

    var iwOuter = $('.gm-style-iw');

    var iwBackground = iwOuter.prev();

    // Remove the background shadow DIV
    iwBackground.children(':nth-child(2)').css({
        'display': 'none'
    });

    // Remove the white background DIV
    iwBackground.children(':nth-child(4)').css({
        'display': 'none'
    });
    /* Tar bort stilen från default-infowindow */
    google.maps.event.addListener(infowindow, 'domready', function() {
        var iwOuter = $('.gm-style-iw');
        var iwBackground = iwOuter.prev();

        iwBackground.children(':nth-child(2)').css({'display' : 'none'});
        iwBackground.children(':nth-child(4)').css({'display' : 'none'});
    });

    var iwCloseBtn = iwOuter.next();

    iwCloseBtn.css({
      opacity: '1', 
      right: '48px', top: '7px', 
      'box-shadow': '0 0 0 2pt #48b5e9', 
      'border-radius': '5px', 
      });
    // The API automatically applies 0.7 opacity to the button after the mouseout event.
    // This function reverses this event to the desired value.
    iwCloseBtn.mouseout(function(){
      $(this).css({opacity: '1'});
    });


}


function getInputTime() {
    /* Hämtar tiden från tidsinputfältet och gör om det till ett date objekt */
    return new Date(document.getElementById("dateInput").value.substring(0, 4)
        , document.getElementById("dateInput").value.substring(5, 7)
        , document.getElementById("dateInput").value.substring(8, 10)
        , document.getElementById("timeInput").value.substring(0, 2)
        , document.getElementById("timeInput").value.substring(3, 5)
        , 0, 0);
}

function searchByButton() {
    /* Hämtar inputdata från html element utför en sökning med datan */
    var destination = document.getElementById("destination-field").value;
    if (document.getElementById("departure").checked == true) {
        var departure = getInputTime();
        var arrival = new Date(0);
    } else {
        var arrival = getInputTime();
        var departure = new Date(0);
    }
    if (document.getElementById("origin-field").value &&
        document.getElementById("origin-field").value != "Nuvarande position") {
        currentPos = document.getElementById("origin-field").value;
    }
    calculateAndDisplayRoute(directionsService, directionsDisplay
        , currentPos, destination
        , departure, arrival);
}


/* Errormeddelande */

function displayError(message) {
    /* Visar errormeddelandet message */
    document.getElementById('errortext').innerHTML = message;
    document.getElementById('errorspace').innerHTML = message;
    $("#errorspace").addClass("alert alert-warning");
    $("#floating-error").fadeIn("fast", function () {});

}

function hideError() {
    /* Döljer aktivt errormeddelande */
    $("#floating-error").fadeOut("fast", function () {});
    $("#errorspace").removeClass("alert alert-warning");
}

$("#closeerror").click(function () {
    /* Tar bort errormeddelande om avstängningskrysset klickas */
    hideError();
});
/*********************/

/* debug log*/
function logGoogleTripData(response) {
    /* Loggar data om routen i 'response' i konsollen */
    if (response.routes[0].legs[0].arrival_time.text != undefined) {
        console.log("Departure time: " + response.routes[0].legs[0].departure_time.text);
        console.log("Arrival time: " + response.routes[0].legs[0].arrival_time.text);
    }

    var steps = response.routes[0].legs[0].steps;
    var stegNr = 0;
    for (i = 0; i < steps.length; i++) {


        if (steps[i].travel_mode == "TRANSIT") {
            var lineName;
            if (steps[i].transit.line.short_name) {
                lineName = steps[i].transit.line.short_name;
                stegNr++;
            } else if (steps[i].transit.line.name) {
                lineName = steps[i].transit.line.name;
                stegNr++;
            }
            console.log("Steg " + stegNr + ": " +
                steps[i].transit.line.vehicle.name +
                "[" + lineName + "] " +
                steps[i].transit.departure_time.text + " " +
                steps[i].transit.departure_stop.name + " > " +
                steps[i].transit.arrival_time.text + " " +
                steps[i].transit.arrival_stop.name + " - " +
                steps[i].duration.text);
        }
    }
}



/***********/


function reverseGeo(pos) {
    console.log(pos.lat);
    console.log(pos.lng);
    
    geocoder.geocode({'latLng': pos}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          document.getElementById("origin-field").value = results[0].formatted_address;
          /* Tänkte returna här men behövs callbacks pga async */
        } else {
          displayError("No results found");
        }
      } else {
        displayError("Geocoder failed due to: " + status);
      }
    });
}
           