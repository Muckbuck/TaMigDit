(function ($) {
    var url = 'https://api.resrobot.se/trip?key=c3770f94-ea2e-427a-95ba-1c1da47b421b&originCoordLat=55.605099&originCoordLong=13.003036&destCoordLat=55.609223&destCoordLong=13.006868&format=json&jsonpCallback=?';

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
                        console.log(json.Trip[y].LegList.Leg[i].Destination.time, json.Trip[y].LegList.Leg[i].Product.catOutL, json.Trip[y].LegList.Leg[i].Product.num, ' to ', json.Trip[0].LegList.Leg[i].Destination.name);
                        
                    } else {
                        console.log(json.Trip[y].LegList.Leg[i].Destination.time, json.Trip[y].LegList.Leg[i].type, ' to ', json.Trip[y].LegList.Leg[i].Destination.name);
                    }
                }
            }
            console.log(legLength)

        },
        error: function (e) {
            console.log(e.message);
        }
    });

})(jQuery);
