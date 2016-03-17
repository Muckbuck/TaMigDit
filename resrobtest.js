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
            var legLength = leg.length;
            
            for (i = 0; i < legLength; i++) {
                console.log(json.Trip[0].LegList.Leg[i].Destination.time);
            }
        
            console.log(legLength)
            console.log(json.Trip[0].LegList.Leg[0].Destination.time);
        },
        error: function (e) {
            console.log(e.message);
        }
    });

})(jQuery);
