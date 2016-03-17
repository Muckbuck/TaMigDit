var url = 'https://api.resrobot.se/trip?key=c3770f94-ea2e-427a-95ba-1c1da47b421b&originCoordLat=55.605099&originCoordLong=13.003036&destCoordLat=55.609223&destCoordLong=13.006868&format=json&jsonpCallback=?';



$.getJSON(url, null, function (data) {
    console.log(data);
});


