var initMap = function () {
    var mymap = L.map('main');



    var cnMap = L.geoJSON(china, {
        style: function(feature) {
            // L.marker((feature.properties.cp),{
            //     title:feature.properties.name
            // }).addTo(mymap)
            return{color:'#5c5c5c',fillColor:'#1e1e1e',weight:1}

        }
    }).addTo(mymap);
    L.geoJSON(bd4, {
        style: function(feature) {
            // case 'Republican': return {color: "red"};
            // case 'Democrat':   return {color: "blue"};
            return{color:'#5c5c5c',fillColor:'#204562',weight:1}

        }
    }).addTo(mymap);
    L.geoJSON(bd3, {
        style: function(feature) {
            // case 'Republican': return {color: "red"};
            // case 'Democrat':   return {color: "blue"};
            return{color:'#5c5c5c',fillColor:'#204562',weight:1}

        }
    }).addTo(mymap);
    var tianjin = L.divIcon({className:'glyphicon glyphicon-plane aircolor'})
    var markerTianjin = L.marker(([39.124444,117.346667]),{
        icon: tianjin,
        title:'天津滨海国际机场'
    }).addTo(mymap)
    // L.popup().setLatLng([39.124444,117.346667]).setContent('天津机场popover');
    markerTianjin.bindTooltip('天津机场',{permanent: true}).openTooltip();


    var beijing = L.divIcon({className:'glyphicon glyphicon-plane aircolor'})
    var markerSJZ = L.marker(([40.268, 116.708]),{
        icon: beijing,
        title:'北京国际机场'
    }).addTo(mymap)
    // L.popup().setLatLng([38.268513071097836,114.70886812756136]).setContent('石家庄正定机场popover').openOn(mymap);
    markerSJZ.bindTooltip('北京国际机场',{permanent: true}).openTooltip();

    //扇区
    var sectorMapWithName = L.geoJSON(sector, {
        style: function(feature) {
            var obj = {
                color:'#32adcc',
                fillColor:'transparent',
                weight:1
            }
            return obj
        },
        onEachFeature: function(feature, layer){
            var title = feature.properties.name + " "
            var opt = {permanent: true}

            // if( feature.properties["sub-name"].indexOf('以上') > -1){
            //     opt.offset = L.point(0,-20)
            // }
            // if( feature.properties["sub-name"].indexOf('以下') > -1){
            //     opt.offset = L.point(0,20)
            // }

            layer.bindTooltip(title, opt)
        }
    })

    var secMap = L.geoJSON(sector, {
        style: function(feature) {
            var obj = {
                color:'#32adcc',
                fillColor:'transparent',
                weight:1
            }
            return obj
        }
    })
    //跑道
    var runwayMap = L.geoJSON(runway, {
        style: function(feature) {
            var obj = {
                color:'#32adcc',
                fillColor:'red',
                weight:1
            }
            return obj
        },
        onEachFeature: function(feature, layer){
            var title = feature.properties.name
            var opt = {permanent: true}
            layer.bindTooltip(title, opt)
        }
    })
    // var accMap = L.geoJSON(acc, {
    //     style: function(feature) {
    //         var obj = {
    //             color:'#32adcc',
    //             fillColor:'transparent',
    //             weight:1
    //         }
    //         return obj
    //     },
    //     onEachFeature: function(feature, layer){
    //         var title = feature.properties.name
    //         var opt = {permanent: true}
    //         layer.bindTooltip(title, opt)
    //     }
    // })

    // var airpointMap = L.geoJSON(airpoint, {
    //     style: function(feature) {
    //         var obj = {
    //             color:'#32adcc',
    //             fillColor:'transparent',
    //             weight:1
    //         }
    //         return obj
    //     },
    //     onEachFeature: function(feature, layer){
    //         var title = feature.properties.name
    //         var opt = {permanent: true}
    //         layer.bindTooltip(title, opt)
    //     }
    // })
    // airpointMap.addTo(mymap)
    mymap.setView([40,100],5)
    var airportImg = {};
    mymap.on('zoomend',function () {
        var zoomIndex = mymap.getZoom();
        if(zoomIndex*1 <= 6){
            sectorMapWithName.remove()
            runwayMap.remove()
            secMap.addTo(mymap)

        }else{
            sectorMapWithName.addTo(mymap)
            runwayMap.addTo(mymap)
        }
        if(zoomIndex*1 == 10){
            var url = "http://192.168.243.67:8080/img/beijingAirport/airport.png";
                imageBounds = [[40.268-zoomIndex*.01, 116.608-zoomIndex*.009], [40.268+zoomIndex*.01, 116.608+zoomIndex*.009]];
                airportImg = L.imageOverlay(url, imageBounds).addTo(mymap);
            }else if(zoomIndex*1<=10){
                airportImg.remove()
        }
        console.log(zoomIndex)
    })

    //定义图层
    var baseMapLaysers = {
        '底图':cnMap,
        '扇区':sectorMapWithName,
        '跑道':runwayMap,
        // '哈哈':accMap,
        // '机场点':airpointMap
    }
    //初始化图层
    // mymap.layer = [cnMap]
    //添加图层控制
    var layerControl = L.control.layers(baseMapLaysers);
    layerControl.addTo(mymap);
    
}();