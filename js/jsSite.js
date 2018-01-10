    // Create the Google Map…
    var map = new google.maps.Map(d3.select("#mapCanvas").node(), {
        zoom: 12,
        center: new google.maps.LatLng(48.117266, -1.677793),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
            // Create the DIV to hold the control and call the CenterControl()
        // constructor passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var controlText = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    /* // Create the search box and link to the UI
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
*/  
    // Initialize variable to stock some importants informations
    var allMarkers = []
    var allLatLng = []
    var rectangle = null;
    var IDS = [];
	var setIDS = new Set();
    var modeVisu = 0
    var setIDS = new Set();
    var indexSlide = 0

    // Create SVG
    var svg = d3.select("#mapSide").append("svg")
        .attr("width", 750)
        .attr("height", 450);

    var width = 600;
    var height = 350;
    var colors = ["blue", "red", "green", "yellow", "brown", "purple", "grey", "pink"]
    var curseur = 0;
    var shift = 200;

    // Variables for manipulate time in the easiest way
    var parseHour = d3.timeParse("%H:%M");
    var displayHour = d3.timeFormat("%H:%M");
    var onlyHour = d3.timeFormat("%H");

    //PARAMETRES A CHANGER POUR FAIRE VARIER !
    var d = new Date("Thu Jan 02 2018 01:00:00 GMT+0100");
    //IDS = [1,2,3,4,5];

    // Split the dateTime
    var hours = d.getHours();
    var minute = d.getMinutes() * 100 / 3 / 60;
    var centralHour = hours;
    var minhour = new Date(d);
    var maxhour = new Date(d);

    // Set interval between the hour
    minhour.setHours(centralHour - 12);
    maxhour.setHours(centralHour + 12);
    /*console.log("minHour")
    console.log(minhour);
    console.log("maxhour")
    console.log(maxhour);
    console.log(d)*/


    // Ordinal scale
    var x = d3.scaleTime()
        .range([0, width])
        .domain([minhour, maxhour]);

    var x2 = d3.scaleLinear()
        .range([0, width])
        .domain([0, 24]);

    var x3 = d3.scaleLinear()
        .domain([0, width])
        .range([0, 24]);

    var xa = d3.scaleTime()
        .range([x2(0), x2(12)])
        .domain([minhour, d]);

    var xb = d3.scaleTime()
        .range([x2(12), x2(24)])
        .domain([d, maxhour]);

    var xc = d3.scaleTime()
        .range([0, width])
        .domain([minhour, maxhour]);

    // Linear scale
    var y = d3.scaleLinear()
        .range([height, height - 300])
        .domain([0, 100]);

    var line = d3.line()
        .x(function(d) {
            return xa(d[0]) + minute - shift;
        })
        .y(function(d) {
            return y(d[1]) + 50;
        });

    var predictline = d3.line()
        .x(function(d) {;
            return xb(d[0]) + minute - shift
        })
        .y(function(d) {
            return y(d[1]) + 50;
        });

    var linkedline = d3.line()
        .x(function(d) {
            return xc(d[0]) + minute - shift
        })
        .y(function(d) {
            return y(d[1]) + 50;
        });

    var g = svg.append("g")
        .attr("transform", "translate(250, 0)")

    var verticalLine = svg.append("line").
    attr("class", "verticalLine");

    /*var tooltip = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 1);
    
    var legende = d3.select("body").append("div") 
      .attr("class", "legende")       
      .style("opacity", 1);*/

    var correspTable = [];
	var parkingTable = [];

    //--------
    /*
     * use google maps api built-in mechanism to attach dom events
     */
    var projection = d3.geoAlbers();
    var path = d3.geoPath()
        .projection(projection);
    d3.json("data/rennes.json", function(json) {
        var boundaries = boundariesRennes(json.geometries[0].coordinates[0][0])
        var boundariesPath = new google.maps.Polyline({
            path: boundaries,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        boundariesPath.setMap(map);
    });


    // Iteration through the parking file
    loadParks()
    function loadParks(){
        d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia", function(json) {

        for (var i = 0; json.records.length; i++) {
			parkingTable.push({
				key: 100+i,
				nom: json.records[i].fields.key
			});
            var coordonnees = json.records[i].fields.geo;
            var content = "<strong> Nom parking : </strong>" + json.records[i].fields.key + "<br /><strong>Places disponibles : </strong>" + json.records[i].fields.free
            var icon_park=""
            var free=json.records[i].fields.free
            var maxi=json.records[i].fields.max
            var remplissage=(maxi-free)/maxi
            
            if (remplissage<0.05) {
                icon_park="img/parking0.png"
        
            }
            else if (remplissage<0.15) {
                icon_park="img/parking10.png"
        
            }
            else if (remplissage<0.25) {
                icon_park="img/parking20.png"
       
            }
            else if (remplissage<0.35) {
                icon_park="img/parking30.png"
           
            }
            else if (remplissage<0.45) {
                icon_park="img/parking40.png"
       
            }
            else if (remplissage<0.55) {
                icon_park="img/parking50.png"
    
            }
            else if (remplissage<0.65) {
                icon_park="img/parking60.png"
 
            }
            else if (remplissage<0.75) {
                icon_park="img/parking70.png"
        
            }
            else if (remplissage<0.85) {
                icon_park="img/parking80.png"
            
            }
            else if (remplissage<0.95) {
                icon_park="img/parking90.png"
         
            }
            else {
                icon_park="img/parking100.png"
            }
            var marker = new google.maps.Marker({
                position: {
                    lat: coordonnees[0],
                    lng: coordonnees[1]
                },
                id: 100 + i,
                icon: icon_park,
                title: json.records[i].fields.key,
                map: map
            });
            var infoWindows = new google.maps.InfoWindow()
                // StackOverFlow
            google.maps.event.addListener(marker, 'click', (function(marker, content, infoWindows) {
                return function() {
                    infoWindows.setContent(content);
                    infoWindows.open(map, marker);
                };
            })(marker, content, infoWindows));
            allMarkers.push(marker)
        };
		
    });
        }
    loadVelo()
    function loadVelo(){
        d3.json("data/veloLocal.json", function(json){
        //d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?rows=100&dataset=etat-des-stations-le-velo-star-en-temps-reel&facet=nom&facet=etat&facet=nombreemplacementsactuels&facet=nombreemplacementsdisponibles&facet=nombrevelosdisponibles", function(json) {
            // Methode Google MAP
            var records = json.records;
            for (var i = 0; i < records.length; i++) {
                var myLatLng = {
                    lat: records[i].geometry.coordinates[1],
                    lng: records[i].geometry.coordinates[0]
                };
                allLatLng.push(myLatLng)
            var content = "<strong> Nom station : </strong>" + records[i].fields.nom + "<br /><strong>Vélos disponibles : </strong>" + records[i].fields.nombrevelosdisponibles + "<br /><strong>Emplacements disponibles : </strong>" + records[i].fields.nombreemplacementsdisponibles
            var url = ""
            if (records[i].fields.etat == "En Panne") {
                url = "img/poi-chantier.png"
            } else {
                var tauxRemplissage = records[i].fields.nombrevelosdisponibles / records[i].fields.nombreemplacementsactuels 
                if (tauxRemplissage == 0) {
                    url = "img/velo0.png"
                } else if (tauxRemplissage < 0.15) {
                    url = "img/velo10.png"
                } else if (tauxRemplissage < 0.25) {
                    url = "img/velo20.png"
                } else if (tauxRemplissage < 0.35) {
                    url = "img/velo30.png"
                } else if (tauxRemplissage < 0.45) {
                    url = "img/velo40.png"
                } else if (tauxRemplissage < 0.55) {
                    url = "img/velo50.png"
                } else if (tauxRemplissage < 0.65) {
                    url = "img/velo60.png"
                } else if (tauxRemplissage < 0.75) {
                    url = "img/velo70.png"
                } else if (tauxRemplissage < 0.85) {
                    url = "img/velo80.png"
                } else if (tauxRemplissage < 0.95) {
                    url = "img/velo90.png"
                } else {
                    url = "img/velo100.png"
                }
            }
            // source marker : https://www.iconfinder.com/
            var marker = new google.maps.Marker({
                id: records[i].fields.idstation,
                position: myLatLng,
                map: map,
                title: records[i].fields.nom,
                icon: url
            });


                var infoWindows = new google.maps.InfoWindow()
                    // StackOverFlow
                google.maps.event.addListener(marker, 'click', (function(marker, content, infoWindows) {
                    return function() {
                        infoWindows.setContent(content);
                        infoWindows.open(map, marker);
                    };
                })(marker, content, infoWindows));
                allMarkers.push(marker)
            }
        });
    }
   
    google.maps.event.addDomListener(window, "load", function() {
        var drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                    google.maps.drawing.OverlayType.RECTANGLE
                ]
            },
            rectangleOptions: {
                strokeWeight: 1,
                clickable: true,
                editable: false,
                zIndex: 1
            }
        });
        drawingManager.setMap(map);

        google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
            if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
                if (rectangle != null)
                    rectangle.setMap(null);
                rectangle = event.overlay;
                var bounds = rectangle.getBounds();

                for (var i = 0; i < allMarkers.length; i++) {
                    if (bounds.contains(allMarkers[i].getPosition())) {
                        //IDS.push(allMarkers[i].id);
						setIDS.add(allMarkers[i].id);
						//console.log(allMarkers[i].id);
                    }
                }
				for(let item of setIDS) IDS.push(item);
                for (var i in IDS) {
                    drawStation(IDS[i], colors[i]);
                }
				
                drawingManager.setDrawingMode(null);
            }
        });

        google.maps.event.addListener(drawingManager, "drawingmode_changed", function() {
            if ((drawingManager.getDrawingMode() == google.maps.drawing.OverlayType.RECTANGLE) &&
                (rectangle != null)) {
                rectangle.setMap(null);
                //console.log("ewe");
                IDS = [];
				setIDS = new Set();
                //d3.selectAll("svg").remove();
                correspTable = [];
                d3.selectAll("path.line").remove();
                //drawLegende(IDS, colors)
				document.getElementById("legende").innerHTML = "";
				document.getElementById("legendePark").innerHTML = "";
            }
        });
        // when the user clicks somewhere else on the map.
        google.maps.event.addListener(map, 'click', function() {
            if (rectangle != null) {
                rectangle.setMap(null);
            }
        });
    });

    function setVelo(){
        d3.json("data/veloLocal.json", function(json){
        //d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?rows=100&dataset=etat-des-stations-le-velo-star-en-temps-reel&facet=nom&facet=etat&facet=nombreemplacementsactuels&facet=nombreemplacementsdisponibles&facet=nombrevelosdisponibles", function(json) {
            var records = json.records;
            for (var i = 0; i < records.length; i++) {
            if (records[i].fields.etat == "En Panne") {
                url = "img/poi-chantier.png"
            } else {
                var tauxRemplissage = records[i].fields.nombrevelosdisponibles / records[i].fields.nombreemplacementsactuels 
                if (tauxRemplissage == 0) {
                    url = "img/velo0.png"
                } else if (tauxRemplissage < 0.15) {
                    url = "img/velo10.png"
                } else if (tauxRemplissage < 0.25) {
                    url = "img/velo20.png"
                } else if (tauxRemplissage < 0.35) {
                    url = "img/velo30.png"
                } else if (tauxRemplissage < 0.45) {
                    url = "img/velo40.png"
                } else if (tauxRemplissage < 0.55) {
                    url = "img/velo50.png"
                } else if (tauxRemplissage < 0.65) {
                    url = "img/velo60.png"
                } else if (tauxRemplissage < 0.75) {
                    url = "img/velo70.png"
                } else if (tauxRemplissage < 0.85) {
                    url = "img/velo80.png"
                } else if (tauxRemplissage < 0.95) {
                    url = "img/velo90.png"
                } else {
                    url = "img/velo100.png"
                }
            }
            allMarkers[i].setIcon(url)
            }
        });
    }

    function setParks(){
         d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia", function(json) {


        for (var i = 0; json.records.length; i++) {
            var icon_park=""
            var free=json.records[i].fields.free
            var maxi=json.records[i].fields.max
            var remplissage=(maxi-free)/maxi
            
            if (remplissage<0.05) {
                icon_park="img/parking0.png"
        
            }
            else if (remplissage<0.15) {
                icon_park="img/parking10.png"
        
            }
            else if (remplissage<0.25) {
                icon_park="img/parking20.png"
       
            }
            else if (remplissage<0.35) {
                icon_park="img/parking30.png"
           
            }
            else if (remplissage<0.45) {
                icon_park="img/parking40.png"
       
            }
            else if (remplissage<0.55) {
                icon_park="img/parking50.png"
    
            }
            else if (remplissage<0.65) {
                icon_park="img/parking60.png"
 
            }
            else if (remplissage<0.75) {
                icon_park="img/parking70.png"
        
            }
            else if (remplissage<0.85) {
                icon_park="img/parking80.png"
            
            }
            else if (remplissage<0.95) {
                icon_park="img/parking90.png"
         
            }
            else {
                icon_park="img/parking100.png"
            
            }
            allMarkers[i+83].setIcon(icon_park)
        }
    });
     }
    function boundariesRennes(data) {
        var resultArray = [];
        for (var i = 0; i < data.length; i++) {
            resultArray.push({
                lat: data[i][1],
                lng: data[i][0]
            });
        }
        var coordsBoundaries = []
        for (var i = 0; i < resultArray.length; i++) {
            coordsBoundaries[i] = new google.maps.LatLng(resultArray[i].lat, resultArray[i].lng);
        }
        return coordsBoundaries;
    }

    svg.append("g")
		.attr("class", "xaxis")
        .attr("transform", "translate(50," + (height + 50) + ")")
        .call(d3.axisBottom(x) /*.tickFormat(d3.timeFormat("%d-%H:%M"))*/ );

    svg.append("g")
		.attr("class", "yaxis")
        .attr("transform", "translate(50," + 50 + ")")
        .call(d3.axisLeft(y));

    function getStation(stationID, records) {
        var station = {};
        records.forEach(function(d) {
            if (d.station_id == stationID) {
                station = d;
            }
        });
        return station;
    }

    function getIndexofStation(stationID, records) {
        var station = {};
        var index, temp = 0;
		records.forEach(function(d) {
			if (d.station_id == stationID) {
				station = d;
				index = temp;
			}
			temp += 1;
		});
		return index;
    }

    function createClearValues(states, modifs) {
        var values = [];
        for (var index in states) {
            var creneau = states[index];
            for (var hour in creneau) {
                var temp = [];
                var time;

                var t = new Date(hour);
                var h = t.getHours();
                var m = t.getMinutes();
                var d = t.getDate();
                t.setHours(h - 1);

                if (m > 55) {
                    t.setHours(h);
                }
                t.setMinutes(0);
                t.setSeconds(0);
                if (t.getHours() == 0) {
                    t.setDate(d);
                }

                if (modifs == 1) {
                    t.setDate(d + 1)
                    if (t.getHours() == 23) {
                        t.setDate(d)
                    }
                }
                if (modifs == 2 && index == 1) {
                    t.setDate(d + 1)
					if (t.getHours() == 23) {
                        t.setDate(d)
                    }
                }

                var newtime = new Date(t);
                time = parseHour(newtime);
                temp[0] = newtime
                temp[1] = creneau[hour];
                values[index] = temp;
                //}
            }
        }
        return values;
    }

    function getData(stationID, records, color) {
        var station = getStation(stationID, records);

        var temp = [];
        var index = 0;
        for (i = curseur - 12; i < curseur; i++) {
            //console.log(i)
            temp[index] = station.etat[i];
            index += 1;
        }
        var values = createClearValues(temp, 0);
        correspTable.push({
            key: stationID,
            nom: station.nom,
            color: color
        });
        //console.log(values)
        return values;
    }

    function getPredictData(stationID, records, color) {
        var station = getStation(stationID, records);
        var temp = [];
        var index = 0;
        // curseur = station.etat.length-47+hours;
        for (i = curseur - 24; i < curseur - 12; i++) {
            temp[index] = station.etat[i];
            index += 1;
        }
        var values = createClearValues(temp, 1);
        return values;
    }

    function getLinkedData(stationID, records, color) {
        var station = getStation(stationID, records);
        var temp = [];
        var index = 0;
        temp[0] = station.etat[curseur - 1];
        temp[1] = station.etat[curseur - 24];
        var values = createClearValues(temp, 2);
		console.log(values);
        return values;
    }
	
	function drawStationAtDate(time){
		//var tempDate = d;
		//d.setHours(tempDate.getHours()+1);
		
		//d = new Date("Thu Jan 03 2018 01:00:00 GMT+0100");
		console.log(time)
		d = new Date(time);
		d3.selectAll("path.line").remove();
		d3.selectAll("g.xaxis").remove();
		
		
		hours = d.getHours();
		centralHour = hours;
		minhour = new Date(d);
		maxhour = new Date(d);

		minhour.setHours(centralHour - 12);
		maxhour.setHours(centralHour + 12);
		
		x = d3.scaleTime()
			.range([0, width])
			.domain([minhour, maxhour]);
		
		svg.append("g")
		.attr("class", "xaxis")
        .attr("transform", "translate(50," + (height + 50) + ")")
        .call(d3.axisBottom(x));
		
		xa = d3.scaleTime()
        .range([x2(0), x2(12)])
        .domain([minhour, d]);

        xb = d3.scaleTime()
        .range([x2(12), x2(24)])
        .domain([d, maxhour]);

        xc = d3.scaleTime()
        .range([0, width])
        .domain([minhour, maxhour]);
/*
		svg.append("g")
			.attr("class", "yaxis")
			.attr("transform", "translate(50," + 50 + ")")
			.call(d3.axisLeft(y));*/
			

		for (var i in IDS) {
			drawStation(IDS[i], colors[i]);
		}
		drawLegende();
	}


	function drawLegende(){
		//console.log(correspTable[1]);
		var value = "Velos <br>";
		var valueP = "Parking <br>";
		for(var id in IDS){
			console.log(IDS[id]);
			if(IDS[id] > 82)
				valueP += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + "</div>";
			else
				value += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + "</div>";
		}
		document.getElementById("legendePark").innerHTML = valueP;
		document.getElementById("legende").innerHTML = value;
	}

    function drawStation(stationID, color) {
        d3.json("data/all_historic.json", function(error, data) {
            if (error) throw error;
			console.log(stationID);
            console.log(getStation(stationID, data.records));
            console.log(data.records);
            console.log(getIndexofStation(stationID, data.records));

			if(stationID > 100){
				var name;
				parkingTable.forEach(function(d) { 
					if(d.key == stationID){
						name = d.nom;
					}
				});
				data.records.forEach(function(d) { 
					if(d.nom == name){
						stationID = d.station_id;;
					}
				});
				console.log(stationID);
			}
			
			
            var state = data.records[getIndexofStation(stationID, data.records)].etat;
            state = createClearValues(state, 0)
            for (var index in state) {
                var same = state[index][0].getTime() === d.getTime();
                var date1 = state[index][0];
                var date2 = d;
                if (date1.getHours() === date2.getHours()) {
                    if (date1.getDate() === date2.getDate()) {
                        curseur = index;
                    }
                }
            }
			

            //console.log(data.records[stationID].etat)

            var clearValues = getData(stationID, data.records, color);
            var clearPredictValues = getPredictData(stationID, data.records, color);
            var clearLinkedValues = getLinkedData(stationID, data.records, color);

            x.domain(d3.extent(clearValues, function(d) {
                return d[0];
            }));
            y.domain([0, 100]);
				
            g.selectAll("line").data([clearValues]).enter().append("path")
                .attr("class", "line")
                .attr("d", line)
                .style("stroke", color)
                .on("mouseover", function(d, i) {
                    d3.select(this).style("opacity", 1)
                    drawInfos(stationID, IDS, colors, 0)
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).style("opacity", 0.8)
                    //tooltip.style("opacity", 0);
                });

            g.selectAll("line").data([clearPredictValues]).enter().append("path")
                .attr("class", "line")
                .attr("d", predictline)
                .style("stroke", color)
                .style("stroke-dasharray", 5)
                .on("mouseover", function(d, i) {
                    d3.select(this).style("opacity", 1)
                    drawInfos(stationID, IDS, colors, 1)
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).style("opacity", 0.8)
                        //tooltip.style("opacity", 0);
                });

            g.selectAll("line").data([clearLinkedValues]).enter().append("path")
                .attr("class", "line")
                .attr("d", linkedline)
                .style("stroke", color)
                .style("stroke-dasharray", 5)
                .on("mouseover", function(d, i) {
                    d3.select(this).style("opacity", 1)
                    drawInfos(stationID, IDS, colors, 2)
                })
                .on("mouseout", function(d, i) {
                    d3.select(this).style("opacity", 0.8)
                        //tooltip.style("opacity", 0);
                });

			  function drawInfos(stationID, IDS, colors, type){
				var xCoordinate = d3.event.pageX;
				var yCoordinate = d3.event.pageY;
				//legende.style("opacity", .9);
				  var index = Math.floor(x3(xCoordinate-1193));
				  var value = "Velos <br>";
				  var valueP = "Parkings <br>";
				  for(var id in IDS){
					var temp;
					//console.log(index);
					//console.log(xCoordinate);
						//value += "<div style=\"color:" + colors[id] + ";\">" + "blabla" + "</div>";
					var write = "";
					if(type == 0){
						temp = getData(IDS[id],data.records, colors[id])
						write += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index][1] + "</div>";
					}
					if(type == 1){
						temp = getPredictData(IDS[id],data.records, colors[id])
						write += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index-12][1] + "</div>";
					}
					if(type == 2){
						temp = getLinkedData(IDS[id],data.records, colors[id])
						write += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index-11][1] + "</div>";
					}
					if(IDS[id] > 82)
						valueP += write;
					else
						value += write;
				  //value += "";
				  }
					document.getElementById("legendePark").innerHTML = valueP;
					document.getElementById("legende").innerHTML = value;
			}
        });
    }
         
    var slider = document.getElementById("slider")
    var playButton = document.getElementById("playButton")
    // From Google API Documentation
    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = '';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.

  
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Mode slider';
        controlUI.appendChild(controlText);

     
        controlUI.addEventListener('click', mapSlider)
      }

function setMapOnAll(map) {
  for (var i = 0; i < allMarkers.length; i++) {
    allMarkers[i].setMap(map);
  }
}

function majSlideBar(i){
    indexSlide = i
    modeVisu = 0
    console.log(indexSlide)
    console.log(modeVisu)
    mapSlider()
}
function mapSlider(){

    if (modeVisu == 0){
        controlText.innerHTML = 'Mode temps réel'
        modeVisu = 1
        slider.style.visibility ="visible"
        playButton.style.visibility = "visible"
   // On supprime les marqueurs d'abord


   console.log(allMarkers)
    d3.json("data/all_historic.json", function(json) {
        // Methode Google MAP
        var records = json.records
        console.log(records.length)
        for (var i = 0; i < records.length; i++) {
            var timeValue = records[i].etat;
            for (nomDate in timeValue[i]){
                var key = nomDate
            }
         

            var tauxRemplissage = records[i].etat[indexSlide][key]  
            if (i == 0){
                console.log(tauxRemplissage)
            }
            if (i <  83){
                if (tauxRemplissage == 0) {
                    url = "img/velo0.png"
                } else if (tauxRemplissage < 15) {
                    url = "img/velo10.png"
                } else if (tauxRemplissage < 25) {
                    url = "img/velo20.png"
                } else if (tauxRemplissage < 35) {
                    url = "img/velo30.png"
                } else if (tauxRemplissage < 45) {
                    url = "img/velo40.png"
                } else if (tauxRemplissage < 55) {
                    url = "img/velo50.png"
                } else if (tauxRemplissage < 65) {
                    url = "img/velo60.png"
                } else if (tauxRemplissage < 75) {
                    url = "img/velo70.png"
                } else if (tauxRemplissage < 85) {
                    url = "img/velo80.png"
                } else if (tauxRemplissage < 95) {
                    url = "img/velo90.png"
                } else {
                    url = "img/velo100.png"
                }
            }else{
                         if (tauxRemplissage<5) {
                icon_park="img/parking0.png"
        
            }
            else if (tauxRemplissage<15) {
                icon_park="img/parking10.png"
        
            }
            else if (tauxRemplissage<25) {
                icon_park="img/parking20.png"
       
            }
            else if (tauxRemplissage<35) {
                icon_park="img/parking30.png"
           
            }
            else if (tauxRemplissage<45) {
                icon_park="img/parking40.png"
       
            }
            else if (tauxRemplissage<55) {
                icon_park="img/parking50.png"
    
            }
            else if (tauxRemplissage<65) {
                icon_park="img/parking60.png"
 
            }
            else if (tauxRemplissage<75) {
                icon_park="img/parking70.png"
        
            }
            else if (tauxRemplissage<85) {
                icon_park="img/parking80.png"
            
            }
            else if (tauxRemplissage<95) {
                icon_park="img/parking90.png"
         
            }
            else {
                icon_park="img/parking100.png"
            
            }  
            }
            allMarkers[i].setIcon(url)
            
        }
      
    }); 
        }else{
        controlText.innerHTML = 'Mode slider'
        slider.style.visibility = "hidden"
        playButton.style.visibility = "hidden"
        modeVisu = 0
        setParks()
        setVelo()
    }
}
