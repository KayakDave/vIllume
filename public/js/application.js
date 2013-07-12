//
//  leaflet.js interface code 
//  Information on leaflet at http://leafletjs.com/examples/quick-start.html
//
var map;
var editMode = false;
var drawControl;
var pdx911;
var tinyIcon = L.Icon.extend({
	options: {
		shadowURL: "../assets/marker-shadow.png",
		iconSize: [15, 25],
		iconAnchor: [12,36],
		shadowSize: [41,41],
		shadowAnchor: [12, 38],
		popupAnchor: [0, -30]
	}
});
var redIcon = new tinyIcon({iconUrl: "../assets/marker-red.png"});
var yellowIcon = new tinyIcon({iconUrl: "../assets/marker-yellow.png"});
var blueIcon = new tinyIcon({iconUrl: "../assets/marker-blue.png"});
var orangeIcon = new tinyIcon({iconUrl: "../assets/marker-orange.png"});
var greenIcon = new tinyIcon({iconUrl: "../assets/marker-green.png"});
var grayIcon = new tinyIcon({iconUrl: "../assets/marker-gray.png"});
var pdxMarkers = [];

function enableEditor() {
	if (!editMode) {
		var myCustomMarker = L.Icon.extend({
		    options: {
		        shadowUrl: null,
		        iconAnchor: new L.Point(12, 12),
		        iconSize: new L.Point(24, 24),
		        iconUrl: 'assets/marker-red.png'
		    }
		});

		var drawnItems = new L.FeatureGroup().addTo(map);

		drawControl = new L.Control.Draw({
			edit: {
				featureGroup: drawnItems
			}
		});

		map.on('draw:created', function(e) {
			drawnItems.addLayer(e.layer);
		});


		map.addControl(drawControl);
		editMode= true;
	} else {
		map.removeControl(drawControl);
		editMode= false;
	}
}

// Sets colors for each population density
function getDensityColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

// Style each state area
function densityStyle(feature) {
    return {
        fillColor: getDensityColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function handoffPdx911(pdx911data) {
	pdx911 = pdx911data;
	waitForMap();
}

var waitCount=0;
function waitForMap() {
	if (waitCount > 4)
		console.log("Error: waiting too long");
	if (!map)
	{
		setTimeout(waitForMap, 200);
		console.log(map);
		waitCount++;
	}
	else
		loadPdx911Markers();
}
function loadPdx911Markers()
{
    for (var i =0;i < pdx911.feed.entry.length;i++)
     {
        pdxEntry = pdx911.feed.entry[i];	
    	latlong = pdxEntry['georss:point'].toString().split(/ /g);
    	lat = latlong[0]; lng = latlong[1];
    	var entryTime = pdxEntry.updated;
    	if (pdxEntry.category[0]['$']['label'].toString() == 'TRAFFIC STOP')
    	{
	    	L.marker([lat, lng], {
	            icon: grayIcon
	        }).addTo(map).bindPopup(pdxEntry.title.toString() + entryTime.toString());
        } else if (pdxEntry.category[0]['$']['label'].toString() == 'SHOTS FIRED') 
        {
	    	L.marker([lat, lng], {
	            icon: redIcon
	        }).addTo(map).bindPopup(pdxEntry.title.toString() + ' ' +  entryTime.toString());
        } else if (pdxEntry.category[0]['$']['label'].toString() == 'MED - MEDICAL') 
        {
	    	L.marker([lat, lng], {
	            icon: orangeIcon
	        }).addTo(map).bindPopup(pdxEntry.title.toString() + ' ' +  entryTime.toString());
        } else {
	    	L.marker([lat, lng], {
	            icon: blueIcon
	        }).addTo(map).bindPopup(pdxEntry.title.toString() + ' ' + entryTime.toString());
        }
    }
}

$(function() {
	var userId = Math.random().toString(16).substring(2,15);
	var socket = io.connect("/");


	var info = $("#infobox");
	var doc = $(document);




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
            icon: greenIcon
        });
 
 		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png',
   			cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
 
       // Set up base maps - only one base map can be displayed at a time
       var base = L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png", { maxZoom: 18, detectRetina: true });
       var style1= L.tileLayer(cloudmadeUrl, {styleId:1, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});
       var style2= L.tileLayer(cloudmadeUrl, {styleId:997, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution });
       var style3= L.tileLayer(cloudmadeUrl, {styleId:7, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution });
       var style4= L.tileLayer(cloudmadeUrl, {styleId:998, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});
	   var gray= L.tileLayer(cloudmadeUrl, {styleId:22677, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});


       var baseMaps = {
       	"Default": base,
       	"Style 1": style1,
       	"Style 2": style2,
       	"Style 3": style3,
       	"Style 4": style4,
       	"Gray": gray
       }

       // Set up overlays
       var roads= L.tileLayer(cloudmadeUrl, {styleId:46561, maxZoom: 18, detectRetina: true, attribution: cloudmadeAttribution});
       // Information on geoJson:  http://leafletjs.com/examples/geojson.html
       var states= L.geoJson(statesData, {style: densityStyle, onEachFeature: onEachFeature});

	   var heatMapLayer = L.TileLayer.heatMap({
   	   	    radius: { value: 150000, absolute: true },
	        opacity: 0.8,
	        gradient: {
	            0.45: "rgb(0,0,255)",
	            0.55: "rgb(0,255,255)",
	            0.65: "rgb(0,255,0)",
	            0.95: "yellow",
	            1.0: "rgb(255,0,0)"
	        }
	    });
	    heatMapLayer.setData(heatMapData.data);


       var overlayMaps = {
       	"Freeways": roads,
       	"State Density": states,
       	"Heat map": heatMapLayer
       }

        // load leaflet map with "base" set as the default map

        map = L.map("map", {layers: [base]});
        L.control.layers(baseMaps,overlayMaps).addTo(map);



        // Add Controls, Info, and legend to state overlay
        // overlayadd and overlayremove events are used to control 
        // visibility of info and legend

        var stateInfo = L.control();

        // When an overlay is added (clicked on) add the state info and legend
        map.on('overlayadd', function(e) {
    
        	if (e.name == 'State Density') {
        		//alert("States overlay added");
        		stateInfo.addTo(map);
        		stateLegend.addTo(map);
        	}
        });

        // When an overlay is removed from view, remove the info and legend
        map.on('overlayremove', function(e) {
    
        	if (e.name == 'State Density') {
        		//alert("States overlay added");
        		stateInfo.removeFrom(map);
        		stateLegend.removeFrom(map);
        	}
        });

		// This listener is attached only to the state layer.  So no other layers
		// will have these controls
		function onEachFeature(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		        click: zoomToFeature
		    });
		}

        function highlightFeature(e) {
		    var layer = e.target;

		    layer.setStyle({
		        weight: 5,
		        color: '#666',
		        dashArray: '',
		        fillOpacity: 0.7
		    });

		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
		    stateInfo.update(layer.feature.properties);
		}

		function resetHighlight(e) {
		    states.resetStyle(e.target);
		    stateInfo.update();
		}

		function zoomToFeature(e) {
		    map.fitBounds(e.target.getBounds());
		}

		
		// Add info panel  (do we end up creating multiple dom elements
		//  if there are multiple add/removes?  Need to investigate)	
		stateInfo.onAdd = function (map) {
		    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    this.update();
		    return this._div;
		};

		// method that we will use to update the control based on feature properties passed
		stateInfo.update = function (props) {
			    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
			        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
			        : 'Hover over a state');
		};

		var stateLegend = L.control({position: 'bottomright'});

		stateLegend.onAdd = function (map) {

		    var div = L.DomUtil.create('div', 'info legend'),
		        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
		        labels = [];

		    // loop through our density intervals and generate a label with a colored square for each interval
		    for (var i = 0; i < grades.length; i++) {
		        div.innerHTML +=
		            '<i style="background:' + getDensityColor(grades[i] + 1) + '"></i> ' +
		            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
		    }

		    return div;
		};
		

         
        // set map bounds
        map.fitWorld();
        userMarker.addTo(map);
        userMarker.bindPopup("<p>You are here.</p>").openPopup();
 
        // Send coordinates back to server
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