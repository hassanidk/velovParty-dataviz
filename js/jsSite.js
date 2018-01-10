    // Create the Google Map…
    var map = new google.maps.Map(d3.select("#mapCanvas").node(), {
        zoom: 12,
        center: new google.maps.LatLng(48.117266, -1.677793),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var allMarkers = []
    var rectangle = null;
    var IDS = [];

    //------
    var svg = d3.select("#mapSide").append("svg")
        .attr("width", 960)
        .attr("height", 450);

    var width = 600;
    var height = 350;
    var colors = ["blue", "red", "green", "yellow", "brown", "purple", "grey", "pink"]
    var curseur = 0;
    var shift = 200;

    var parseHour = d3.timeParse("%H:%M");
    var displayHour = d3.timeFormat("%H:%M");
    var onlyHour = d3.timeFormat("%H");

    //PARAMETRES A CHANGER POUR FAIRE VARIER !
    var d = new Date("Thu Jan 02 2018 03:00:00 GMT+0100");
    //IDS = [1,2,3,4,5];


    var hours = d.getHours();
    var minute = d.getMinutes() * 100 / 3 / 60;
    var centralHour = hours;
    var minhour = new Date(d);
    var maxhour = new Date(d);

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

    d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?dataset=export-api-parking-citedia", function(json) {

        for (var i = 0; json.records.length; i++) {
            var coordonnees = json.records[i].fields.geo;
            var icon_park=""
            var free=json.records[i].fields.free
            var maxi=json.records[i].fields.max
            var remplissage=(maxi-free)/maxi
            console.log(remplissage)
            if (remplissage<0.05) {
                icon_park="img/parking0.png"
                console.log("0")
            }
            else if (remplissage<0.15) {
                icon_park="img/parking10.png"
                console.log("1")
            }
            else if (remplissage<0.25) {
                icon_park="img/parking20.png"
                console.log("2")
            }
            else if (remplissage<0.35) {
                icon_park="img/parking30.png"
                console.log("3")
            }
            else if (remplissage<0.45) {
                icon_park="img/parking40.png"
                console.log("4")
            }
            else if (remplissage<0.55) {
                icon_park="img/parking50.png"
                console.log("5")
            }
            else if (remplissage<0.65) {
                icon_park="img/parking60.png"
                console.log("6")
            }
            else if (remplissage<0.75) {
                icon_park="img/parking70.png"
                console.log("7")
            }
            else if (remplissage<0.85) {
                icon_park="img/parking80.png"
                console.log("8")
            }
            else if (remplissage<0.95) {
                icon_park="img/parking90.png"
                console.log("9")
            }
            else {
                icon_park="img/parking100.png"
                console.log("10")
            }
            var marker = new google.maps.Marker({
                position: {
                    lat: coordonnees[0],
                    lng: coordonnees[1]
                },
                store_id: 100 + i,
                icon: icon_park,
                title: json.records[i].fields.key,
                map: map
            });

            allMarkers.push(marker)
        };
    });

    d3.json("https://data.rennesmetropole.fr/api/records/1.0/search/?rows=100&dataset=etat-des-stations-le-velo-star-en-temps-reel&facet=nom&facet=etat&facet=nombreemplacementsactuels&facet=nombreemplacementsdisponibles&facet=nombrevelosdisponibles", function(json) {
        // Methode Google MAP
        var records = json.records;
        for (var i = 0; i < records.length; i++) {
            var myLatLng = {
                lat: records[i].geometry.coordinates[1],
                lng: records[i].geometry.coordinates[0]
            };
            var content = "<strong> Nom station : </strong>" + records[i].fields.nom + "<br /><strong>Vélos disponibles : </strong>" + records[i].fields.nombrevelosdisponibles + "<br /><strong>Emplacements disponibles : </strong>" + records[i].fields.nombreemplacementsdisponibles
            var url = ""
            if (records[i].fields.etat == "En Panne") {
                url = "img/poi-chantier.png"
            } else {
                var tauxRemplissage = records[i].fields.nombrevelosdisponibles / records[i].fields.nombreemplacementsdisponibles
                if (tauxRemplissage == 0) {
                    url = "img/station-0.png"
                } else if (tauxRemplissage < 25) {
                    url = "img/station-25.png"
                } else if (tauxRemplissage < 50) {
                    url = "img/station-50.png"
                } else if (tauxRemplissage < 75) {
                    url = "img/station-75.png"
                } else {
                    url = "img/station-100.png"
                }
            }

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
                console.log(bounds);


                for (var i = 0; i < allMarkers.length; i++) {
                    if (bounds.contains(allMarkers[i].getPosition())) {
                        // TODO ANTHONY FAINEANT
                        // Je t'aide un peu pour l'intégration, tu as le choix. Soit t'utilise l'id et appelle ta fonction pour chaque ID
                        // Soit tu cree une liste, puis tu fais passer ta liste dans ta fonction
                        // Je suis gentil ton intégration va se faire sans souci, j'ai aucun svg, par contre tu l'affecte à la div mapSide
                        // Enjoy (ET supprime ces commentaires après ;))

                        IDS.push(allMarkers[i].id);

                    }
                }
                for (var i in IDS) {
                    drawStation(IDS[i], colors[i]);
                }
                //console.log(allMarkers);
                drawingManager.setDrawingMode(null);
            }
        });

        google.maps.event.addListener(drawingManager, "drawingmode_changed", function() {
            if ((drawingManager.getDrawingMode() == google.maps.drawing.OverlayType.RECTANGLE) &&
                (rectangle != null)) {
                rectangle.setMap(null);
                console.log("ewe");
                IDS = [];
                //d3.selectAll("svg").remove();
                correspTable = [];
                d3.selectAll("path.line").remove();
                //drawLegende(IDS, colors)
				document.getElementById("legende").innerHTML = "";
            }
        });
        // when the user clicks somewhere else on the map.
        google.maps.event.addListener(map, 'click', function() {
            if (rectangle != null) {
                rectangle.setMap(null);
            }
        });
    });

    console.log(allMarkers)

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
        .attr("transform", "translate(50," + (height + 50) + ")")
        .call(d3.axisBottom(x) /*.tickFormat(d3.timeFormat("%d-%H:%M"))*/ );


    svg.append("g")
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
                var time = index + ":00";

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
        return values;
    }

    function drawStation(stationID, color) {
        d3.json("data/allHistoric.json", function(error, data) {
            if (error) throw error;
            console.log(getStation(stationID, data.records));
            //console.log(data.records);
            console.log(data.records[getIndexofStation(stationID, data.records)].etat);

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
					var index = Math.floor(x3(xCoordinate-882));
				  var value = ""; // = "Heure : " + index + ":00" + "<br><br>";
				  for(var id in IDS){
					var temp;

						//value += "<div style=\"color:" + colors[id] + ";\">" + "blabla" + "</div>";
					if(type == 0){
						temp = getData(IDS[id],data.records, colors[id])
						value += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index][1] + "</div>";
					}
					if(type == 1){
						temp = getPredictData(IDS[id],data.records, colors[id])
						value += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index-12][1] + "</div>";
					}
					if(type == 2){
						temp = getLinkedData(IDS[id],data.records, colors[id])
						value += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + " : "+temp[index-11][1] + "</div>";
					}
				  }
				  //value += "";
				  document.getElementById("legende").innerHTML = value;

				}

        });

        function drawLegende(IDS, colors) {
            var value = ""; // = "Heure : " + index + ":00" + "<br><br>";
            for (var id in IDS) {
                var temp = getData(IDS[id], data.records, colors[id])
                    //console.log(temp);
                    //console.log(xCoordinate);
                    //value += "<div style=\"color:" + colors[id] + ";\">" + "blabla" + "</div>";
                value += "<div style=\"color:" + colors[id] + ";\">" + correspTable[id].nom + "</div>";
            }
            document.getElementById("legende").innerHTML = value;
            console.log(value);
        }
    }