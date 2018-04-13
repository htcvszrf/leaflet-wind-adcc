var initMap = function () {
    var mymap = L.map('main');
    //中国轮廓图
    var cnMap = L.geoJSON(china, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#666',
                weight: .8,
                // fillOpacity:1
            }

        }
    }).addTo(mymap);
    //边境地图
    L.geoJSON(bd4, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#ccc',
                weight: .8,
                // fillOpacity:1
            }

        }
    }).addTo(mymap);
    //边境地图
    L.geoJSON(bd3, {
        style: function (feature) {
            return {
                color: '#5c5c5c',
                fillColor: '#ccc',
                weight: .8,
                // fillOpacity:1
            }

        }
    }).addTo(mymap);
    /**
     * 控制器
     * @param obj 图层对象
     */
    var controlMapsFunc = function (obj) {
        var zoomIndex = mymap.getZoom();
        console.log(zoomIndex)
        if ($.isArray(obj)) {
            $.each(obj, function (i, e) {
                if (zoomIndex * 1 >= 7) {
                    if (mymap.hasLayer(e)) {
                        e.eachLayer(function (layer) {
                            layer.openTooltip();
                        })
                    }
                } else if (zoomIndex * 1 < 7) {
                    e.eachLayer(function (layer) {
                        layer.closeTooltip();
                    })
                }
            })
        } else {
            if (zoomIndex * 1 >= 7) {
                if (mymap.hasLayer(obj)) {
                    obj.eachLayer(function (layer) {
                        layer.openTooltip();
                    })

                }
            } else if (zoomIndex * 1 < 7) {
                obj.eachLayer(function (layer) {
                    layer.closeTooltip();
                })
            }
        }
        //判断机场是否显示条件
        if (zoomIndex * 1 > 10) {
            if (!$.isEmptyObject(airportImg) && $.isValidObject(airportImg)) {
                airportImg.setOpacity(1);
            }
        } else if (zoomIndex * 1 < 10) {
            console.log('hide')
            if ($.isEmptyObject(airportImg)) {
                return
            } else if ($.isValidObject(airportImg)) {
                airportImg.setOpacity(0);
            }
        }
        if (zoomIndex * 1 == 10 && $.isEmptyObject(airportImg)&&mymap.hasLayer(airpointMap)) {
            var url = "http://192.168.243.67:8080/img/beijingAirport/airport.png";
            imageBounds = [
                [40.07222222222222 - zoomIndex * .01, 116.59722222222221 - zoomIndex * .009],
                [40.07222222222222 + zoomIndex * .01, 116.59722222222221 + zoomIndex * .009]
            ];
            airportImg = L.imageOverlay(url, imageBounds).addTo(mymap);
        }
    }


    var laysersMap = [];
    //扇区
    var secMap = L.geoJSON(sector, {
        style: function (feature) {
            var obj = {
                color: '#3333ff',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + " " + feature.properties["sub-name"]
            var opt = {
                permanent: true,
                className:'sector'
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
        controlMapsFunc(secMap)
    })
    laysersMap.push(secMap)

    //航路
    // var airwayMap = L.geoJSON(airway, {
    //     style: function (feature) {
    //         var obj = {
    //             color: '#32adcc',
    //             fillColor: 'red',
    //             weight: 1
    //         }
    //         return obj
    //     },
    //     onEachFeature: function (feature, layer) {
    //         var title = feature.properties.identifier
    //         var opt = {
    //             permanent: true
    //         }
    //         layer.bindTooltip(title, opt)
    //         layer.closeTooltip();
    //     }
    // }).on('add', function () {
    //     controlMapsFunc(airwayMap)
    // })
    // laysersMap.push(airwayMap)

    //管制区
    var accMap = L.geoJSON(acc, {
        style: function (feature) {
            var obj = {
                color: '#165e83',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + '管制区'
            var opt = {
                permanent: true,
                className:''
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc(accMap)
    })
    laysersMap.push(accMap)

    //进近终端区
    var appterMap = L.geoJSON(appter, {
        style: function (feature) {
            var obj = {
                color: '#1e50a2',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope
            var opt = {
                permanent: true,
                className:'appter'
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc(appterMap)
    })
    laysersMap.push(appterMap)

    //进近扇区
    var appsectorMap = L.geoJSON(appsector, {
        style: function (feature) {
            var obj = {
                color: '#59b9c6',
                fillColor: 'transparent',
                weight: 1
            }
            return obj
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope
            var opt = {
                permanent: true,
                className:'appsector'
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc(appsectorMap)
    })
    laysersMap.push(appsectorMap)
    //情报区
    // var firMap = L.geoJSON(fir, {
    //     style: function (feature) {
    //         var obj = {
    //             color: 'pink',
    //             fillColor: 'transparent',
    //             weight: 1
    //         }
    //         return obj
    //     },
    //     onEachFeature: function (feature, layer) {
    //         var title = feature.properties.name + '-'+ feature.properties.cnName + '情报区'
    //         var opt = {
    //             permanent: true
    //         }
    //         layer.bindTooltip(title, opt)
    //         layer.closeTooltip();
    //     }
    // }).on('add', function () {
    //     controlMapsFunc(firMap)
    // })
    // laysersMap.push(firMap)
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
                permanent: true,
                className:'apName'
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc(airpointMap)
    })
    laysersMap.push(airpointMap)
    //跑道
    var runwayMap = L.geoJSON(runway, {
        style: function (feature) {
            var obj = {
                color: '#0033ff',
                fillColor: '#0033ff',
                weight: 1
            }
            return obj
        },
        // onEachFeature: function (feature, layer) {
        //     var title = feature.properties.name
        //     var opt = {
        //         permanent: true
        //     }
        //     layer.bindTooltip(title, opt)
        //     layer.closeTooltip();
        // }
    }).on('add', function () {
        controlMapsFunc(runwayMap)
    })
    laysersMap.push(runwayMap)
    //合并机场点和跑道
    var airports = L.featureGroup([runwayMap,airpointMap])

    // 航路点图标
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
            if($.isValidVariable(feature.properties.identifier)){
                var title = feature.properties.identifier + "-" + feature.properties.name;
            }else{
                var title = feature.properties.name;
            }
            var opt = {
                permanent: true,
                className:'airwaypoint'
            }
            layer.bindTooltip(title, opt)
            layer.closeTooltip();
        }
    }).on('add', function () {
        controlMapsFunc(waypointMap)
    })
    laysersMap.push(waypointMap)
    //设置地图中心视角
    mymap.setView([40, 100], 4)

    // 北京机场底图
    var airportImg = "";


    //放大缩小控制器
    mymap.on('zoomend', function () {
        controlMapsFunc(laysersMap)
    })


    //风向图层
    var velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
            velocityType: '风向图',
            displayPosition: 'bottom left',
            displayEmptyString: 'No wind data'
        },
        data: wind,
        maxVelocity: 10
    }).on('add', function () {

    });

    //定义图层
    var baseMapLaysers = {
        '中国': cnMap,
    }
    //添加图层控制
    var layerControl = L.control.layers(baseMapLaysers);
    layerControl.addTo(mymap);
    layerControl.addOverlay(secMap, '扇区');
    // layerControl.addOverlay(runwayMap, '跑道');
    layerControl.addOverlay(airports, '机场');
    layerControl.addOverlay(velocityLayer, '风向图');
    // layerControl.addOverlay(airwayMap, '航路');
    layerControl.addOverlay(accMap, '管制区');
    layerControl.addOverlay(appsectorMap, '进近扇区');
    layerControl.addOverlay(appterMap, '进近终端区');
    // layerControl.addOverlay(firMap, '情报区');
    layerControl.addOverlay(waypointMap, '航路点');


}();