function () {
    var url = 'https://api.resrobot.se/trip?key=c3770f94-ea2e-427a-95ba-1c1da47b421b&originCoordLat=' +
        currentRouteData.currentPos.lat +
        '&originCoordLong=' +
        currentRouteData.currentPos.lng +
        '&destCoordLat=' +
        currentRouteData.destination.lat +
        '&destCoordLong=' +
        currentRouteData.destination.lng +
        '&format=json&jsonpCallback=?';


    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (json) {


            console.log(json);
            var leg = json.Trip[0].LegList.Leg;
            var trip = json.Trip;
            var tripLength = trip.length;
            var legLength = leg.length;

            for (y = 0; y < tripLength; y++) {
                for (i = 0; i < legLength; i++) {



                    if (leg[i].hasOwnProperty('Product')) {
                        var jsonTime = json.Trip[y].LegList.Leg[i].Origin.time;
                        var subTime = jsonTime.substring(0, 5);

                        console.log(subTime, json.Trip[y].LegList.Leg[i].Product.catOutL, json.Trip[y].LegList.Leg[i].Product.num, ' to ', json.Trip[0].LegList.Leg[i].Destination.name);



                        document.getElementById('transTimes').innerHTML += subTime + ' ' + json.Trip[y].LegList.Leg[i].Product.catOutL + ' ' + json.Trip[y].LegList.Leg[i].Product.num + ' to ' + json.Trip[0].LegList.Leg[i].Destination.name + '<br></br>';


                    }
                }
            }
            console.log(legLength)


        },
        error: function (e) {
            console.log(e.message);
        }
    });

}
