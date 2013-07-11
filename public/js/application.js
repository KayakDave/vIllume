jQuery(function() {
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect("/");
	var map;

	var info = $("#infobox");
	var doc = $(document);

	var tinyIcon = L.Icon.extend({
		options: {
			shadowURL: "../assets/marker-shadow.png",
			iconSize: [25, 39],
			iconAnchor: [12,36],
			shadowSize: [41,41],
			shadowAnchor: [12, 38],
			popupAnchor: [0, -30]
		}
	});

var redIcon = new tinyIcon({iconUrl: "../assets/marker-red.png"});
var yellowIcon = new tinyIcon({iconUrl: "../assets/marker-yellow.png"});

var sentData= {};
var connects= {};
var markers= {};
var active= false;

socket.on("load:coords", function(data) {
	if (!(data.id in connectes)) {
		setMarker(data);
	}

	connects[data.id] = data;
	connects[data.id].updated = $.now();
});

 if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positionSuccess, positionError, { enableHighAccuracy: true });
    } else {
        $(".map").text("Your browser does not provide geolocation");
    }
 
    function positionSuccess(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        var acr = position.coords.accuracy;
 
        // mark user's position
        var userMarker = L.marker([lat, lng], {
            icon: redIcon
        });
 
 		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png',
   			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
 
        // leaflet API key tiler
       var base = L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png", { maxZoom: 18, detectRetina: true });
       var style1= L.tileLayer(cloudmadeUrl, {styleId:1, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});
       var style2= L.tileLayer(cloudmadeUrl, {styleId:997, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution });
       var style3= L.tileLayer(cloudmadeUrl, {styleId:7, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution });
       var style4= L.tileLayer(cloudmadeUrl, {styleId:998, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});
       var roads= L.tileLayer(cloudmadeUrl, {styleId:46561, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});

       var baseMaps = {
       	"Default": base,
       	"Style 1": style1,
       	"Style 2": style2,
       	"Style 3": style3,
       	"Style 4": style4
       }

       var overlayMaps = {
       	"Freeways": roads
       }


        // load leaflet map
        map = L.map("map", {layers: [base]});
        L.control.layers(baseMaps,overlayMaps).addTo(map);
         
        // set map bounds
        map.fitWorld();
        userMarker.addTo(map);
        userMarker.bindPopup("<p>You are here.</p>").openPopup();
 
        // send coords on when user is active
        doc.on("mousemove", function() {
            active = true; 
 
            sentData = {
                id: userId,
                active: active,
                coords: [{
                    lat: lat,
                    lng: lng,
                    acr: acr
                }]
            }
            socket.emit("send:coords", sentData);
        });
    }
 
    doc.bind("mouseup mouseleave", function() {
        active = false;
    });
 
    // showing markers for connections
    function setMarker(data) {
        for (i = 0; i < data.coords.length; i++) {
            var marker = L.marker([data.coords[i].lat, data.coords[i].lng], { icon: yellowIcon }).addTo(map);
            marker.bindPopup("<p>One more external user is here!</p>");
            markers[data.id] = marker;
        }
    }
 
    // handle geolocation api errors
    function positionError(error) {
        var errors = {
            1: "Authorization fails", // permission denied
            2: "Can\'t detect your location", //position unavailable
            3: "Connection timeout" // timeout
        };
        showError("Error:" + errors[error.code]);
    }
 
    function showError(msg) {
        info.addClass("error").text(msg);
    }
 
    // delete inactive users every 15 sec
    setInterval(function() {
        for (ident in connects){
            if ($.now() - connects[ident].updated > 15000) {
                delete connects[ident];
                map.removeLayer(markers[ident]);
            }
        }
    }, 15000);
});