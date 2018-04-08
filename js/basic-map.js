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




    var tianjin = L.divIcon({className:'tianjin'})
    var markerTianjin = L.marker(([39.124444,117.346667]),{
        icon: tianjin,
        title:'天津滨海国际机场'
    }).addTo(mymap)
    // L.popup().setLatLng([39.124444,117.346667]).setContent('天津机场popover');
    markerTianjin.bindTooltip('天津机场popover',{permanent: true}).openTooltip();


    var beijing = L.divIcon({className:'beijing'})
    var markerSJZ = L.marker(([38.268513071097836,114.70886812756136]),{
        icon: beijing,
        title:'石家庄正定机场'
    }).addTo(mymap)
    // L.popup().setLatLng([38.268513071097836,114.70886812756136]).setContent('石家庄正定机场popover').openOn(mymap);
    markerSJZ.bindTooltip('石家庄正定机场popover',{permanent: true}).openTooltip();

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
            var title = feature.properties.name + " " + feature.properties["sub-name"]
            var opt = {permanent: true}

            if( feature.properties["sub-name"].indexOf('以上') > -1){
                opt.offset = L.point(0,-20)
            }
            if( feature.properties["sub-name"].indexOf('以下') > -1){
                opt.offset = L.point(0,20)
            }

            layer.bindTooltip(title, opt)
        }
    })

    var sectorMap = L.geoJSON(sector, {
        style: function(feature) {
            var obj = {
                color:'#32adcc',
                fillColor:'transparent',
                weight:1
            }
            return obj
        }
    })

    sectorMap.addTo(mymap)

    mymap.setView([40,100],5)
    mymap.on('zoomend',function () {
        var zoomIndex = mymap.getZoom();
        if(zoomIndex*1 <= 6){
            sectorMapWithName.remove()
            sectorMap.addTo(mymap)

        }else{
            sectorMap.remove()
            sectorMapWithName.addTo(mymap)
        }


        console.log(zoomIndex)
    })

    //定义图层
    var baseMapLaysers = {
        'baseMap':cnMap,
        'sectorMap':seMap
    }
    //初始化图层
    mymap.layer = [cnMap]
    //添加图层控制
    var layerControl = L.control.layers(baseMapLaysers);
    layerControl.addTo(mymap);
    
}();