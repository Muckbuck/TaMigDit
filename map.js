var map;
var infowindow;
var directionsService;
var directionsDisplay;
var currentRouteData = {};
/*Default nuvarande position*/
var currentPos = {
    lat: 56.605099,
    lng: 13.003036
};

/* Ändra tidsväljaren till nuvarande tid */
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

console.log(d.getMonth() + 1);
console.log(d.getFullYear()+0);
/******************************************/

/* Resnar originfältet första gången den markeras */
var defaultOrigin = true;
document.getElementById("origin-field").addEventListener('focus', function (e) {
    if (defaultOrigin) {
        this.value = '';
        defaultOrigin = false;
    }
}, true);
/**************************************************/

/* Ser till att båda destinationsfält har samma info */
var firstField = document.getElementById('destination-field'),
    secondField = document.getElementById('menu-destination-field');

firstField.onkeyup = function () {
    secondField.value = firstField.value;
};
secondField.onkeyup = function () {
    firstField.value = secondField.value;
};


window.initMap = function(){
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    
    var customMapType = new google.maps.StyledMapType([
        {
            "featureType": "transit.station.bus",
            "stylers": [
                {
                    "hue": "#1900ff"
                }
        ]
      }
    ], {
        name: 'Custom Style'
    });
    var customMapTypeId = 'custom_style';

    map = new google.maps.Map(document.getElementById('map'), {
        center: currentPos,
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

    var errorspace = document.getElementById('errorspace');
    
    
    var rendererOptions = {
        map: map,
        //panel: errorspace,
        hideRouteList: true
    };
    directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    
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
    document.getElementById("go-button").addEventListener("click", searchByButton);
    document.getElementById("menu-go-button").addEventListener("click", searchByButton);


    /*************************/

    /* Vid klickning på kartan */
    map.addListener('click', function (event) {
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
        console.log(destination);
        calculateAndDisplayRoute(directionsService, directionsDisplay,
            currentPos, destination,
            departure, arrival);

    });
    /***********************/
}

function createSimpleMarker(place, message) {
    /* Skapar en markör på position place */
    var marker = new google.maps.Marker({
        position: place,
        map: map,
        title: message
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(message);
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
    createSimpleMarker(currentPos, "Din nuvarande position");

    var infowindow3 = new google.maps.InfoWindow({
        content: "Din position"
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay,
    origin, destination, departure, arrival) {
    /* Tar emot två positioner, origin och destination och räknar ut bästa
     * resväg med kollektivtrafik och visar upp resvägen på karta.
     * Kan även ta emot departure och arrival tid och inkludera det i sökningen.*/
    //console.log(departure);
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.TRANSIT,
        transitOptions: {
            departureTime: departure,
            arrivalTime: arrival
        }
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            /* Vid lyckad sökning: */
            currentRouteData = {
                departure: departure,
                arrival: arrival,
                currentPos: currentPos,
                destination: destination
            };


            //console.log(response.routes[0].legs[0]);
            document.getElementById('errorspace').innerHTML = "";
            document.getElementById("destination-field").value =
                response.routes[0].legs[0].end_address;
            document.getElementById("menu-destination-field").value =
                response.routes[0].legs[0].end_address;
            
            
            
            directionsDisplay.setDirections(response);
            
            /*Här körs getResData() som finns i resrobtest.js*/
            getResData();
            
            /********* Massa loggad info, inget mer ***************************//*
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
            /********************************************************************/
        } else {
            console.log(status);
            if (status == "ZERO_RESULTS") {
                document.getElementById('errorspace').innerHTML = "Kunde inte hitta någon väg till vald destination";
            } else {
                document.getElementById('errorspace').innerHTML = 'Directions request failed due to ' + status;
            }
        }
    });
}

function getInputTime() {
    /* Hämtar tiden från tidsinputfältet och gör om det till ett date objekt */
    return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate(),
        document.getElementById("timeInput").value.substring(0, 2),
        document.getElementById("timeInput").value.substring(3, 5),
        00, 00);
}

function searchByButton() {
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
    calculateAndDisplayRoute(directionsService, directionsDisplay,
        currentPos, destination,
        departure, arrival);

}

function getCurrentRouteData() {
    return currentRouteData;
}

