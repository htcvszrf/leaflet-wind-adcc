var initMap = function () {
    var mymap = L.map('main');
    //中国轮廓图
    var cnMap = L.geoJSON(china, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#1e1e1e',
                weight: 1
            }

        }
    }).addTo(mymap);
    //边境地图
    L.geoJSON(bd4, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#204562',
                weight: 1
            }

        }
    }).addTo(mymap);
    //边境地图
    L.geoJSON(bd3, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#204562',
                weight: 1
            }

        }
    }).addTo(mymap);

    var controlMapsFunc = function () {
        var zoomIndex = mymap.getZoom();
        console.log(zoomIndex);
        if (zoomIndex * 1 >= 7) {
            //显示扇区文字
            if (mymap.hasLayer(secMap)) {
                secMap.eachLayer(function (layer) {
                    layer.openTooltip();
                })
            }
            //显示机场点文字
            if (mymap.hasLayer(airpointMap)) {
                airpointMap.eachLayer(function (layer) {
                    layer.openTooltip();
                })
            }
            //显示跑道文字
            if (mymap.hasLayer(runwayMap)) {
                runwayMap.eachLayer(function (layer) {
                    layer.openTooltip();
                })
            }
        } else if (zoomIndex * 1 < 7) {
            // 隐藏扇区文字
            if (mymap.hasLayer(secMap)) {
                secMap.eachLayer(function (layer) {
                    layer.closeTooltip();
                })
            }
            //隐藏机场文字
            if (mymap.hasLayer(airpointMap)) {
                airpointMap.eachLayer(function (layer) {
                    layer.closeTooltip();
                })
            }
            //隐藏跑道文字
            if (mymap.hasLayer(runwayMap)) {
                runwayMap.eachLayer(function (layer) {
                    layer.closeTooltip();
                })
            }
        }
        if (zoomIndex * 1 == 10) {
            var url = "http://192.168.243.67:8080/img/beijingAirport/airport.png";
            imageBounds = [
                [40.07222222222222 - zoomIndex * .01, 116.59722222222221 - zoomIndex * .009],
                [40.07222222222222 + zoomIndex * .01, 116.59722222222221 + zoomIndex * .009]
            ];
            airportImg = L.imageOverlay(url, imageBounds).addTo(mymap);
        }
    }
    //扇区
    var secMap = L.geoJSON(sector, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + " " + feature.properties["sub-name"]
            var opt = {
                permanent: true
            }
            if (feature.properties["sub-name"].indexOf('以上') > -1) {
                opt.offset = L.point(0, -20)
            }
            if (feature.properties["sub-name"].indexOf('以下') > -1) {
                opt.offset = L.point(0, 20)
            }
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })
    //跑道
    var runwayMap = L.geoJSON(runway, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'red',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    //航路
    var airwayMap = L.geoJSON(airway, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'red',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.identifier
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    //管制区
    var accMap = L.geoJSON(acc, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'red',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.identifier
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    //进近终端区
    var appterMap = L.geoJSON(appter, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    //进近扇区
    var appsectorMap = L.geoJSON(appsector, {
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    //情报区
    var firMap = L.geoJSON(fir, {
        style: function (feature) {
            var obj = {
                color: 'pink',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + '-'+ feature.properties.cnName + '情报区'
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

    // 机场图标
    var airportIcon = L.icon({
        iconUrl: 'img/airport.png',
        iconSize: [18, 18],
    })

    //机场点
    var airpointMap = L.geoJSON(airpoint, {
        // 添加机场图标
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: airportIcon,
            })
        },
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })

// 机场图标
    var waypointIcon = L.icon({
        iconUrl: 'img/waypoint.png',
        iconSize: [18, 18],
    })
    //航路点
    var waypointMap = L.geoJSON(waypoint, {
        // 添加机场图标
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.marker(latlng, {
                icon: waypointIcon,
            })
        },
        style: function (feature) {
            var obj = {
                color: '#32adcc',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.identifier+ "-"+ feature.properties.name
            var opt = {
                permanent: true
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc()
    })
    //设置地图中心视角
    mymap.setView([40, 100], 5)

    // 北京机场底图
    var airportImg = {};


    //放大缩小控制器
    mymap.on('zoomend', controlMapsFunc)


    //风向图层
    var velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
            velocityType: 'GBR Wind',
            displayPosition: 'bottom left',
            displayEmptyString: 'No wind data'
        },
        data: wind,
        maxVelocity: 5
    });

    //定义图层
    var baseMapLaysers = {
        '中国': cnMap,
    }
    //添加图层控制
    var layerControl = L.control.layers(baseMapLaysers);
    layerControl.addTo(mymap);
    layerControl.addOverlay(secMap, '扇区');
    layerControl.addOverlay(runwayMap, '跑道');
    layerControl.addOverlay(airpointMap, '机场点');
    layerControl.addOverlay(velocityLayer, '风向图');
    layerControl.addOverlay(airwayMap, '航路');
    layerControl.addOverlay(accMap, '管制区');
    layerControl.addOverlay(appsectorMap, '进近扇区');
    layerControl.addOverlay(appterMap, '进近终端区');
    layerControl.addOverlay(firMap, '情报区');
    layerControl.addOverlay(waypointMap, '航路点');


}();