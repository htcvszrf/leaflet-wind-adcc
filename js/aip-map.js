/**
 * Created by caowei on 2018/5/24.
 */
var AipMap = function () {
    //定义图层对象
    var layersGroup = {};
    //定义获取瓦片ip
    var ipHost = 'http://192.168.243.8:7070/geoserver/gwc/service/wms';

    //扇区
    var secMap = L.geoJSON(sector, {
        style: function (feature) {
            var obj = {
                color: "#3333ff",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title =
                feature.properties.name + " " + feature.properties["sub-name"];
            var opt = {
                permanent: true,
                className: "sector"
            };
            if (feature.properties["sub-name"].indexOf("以上") > -1) {
                opt.offset = L.point(0, -20);
            }
            if (feature.properties["sub-name"].indexOf("以下") > -1) {
                opt.offset = L.point(0, 20);
            }
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    });
    // 更新图层id
    secMap['_leaflet_id'] = 'secMap';
    layersGroup['secMap'] = secMap;
    //航路
    var airwayMap = L.tileLayer.wms(ipHost, {layers: 'chinaosm:airway', format: 'image/png8'});
    // 更新图层id
    airwayMap['_leaflet_id'] = 'airwayMap';
    layersGroup['airwayMap'] = airwayMap;
    //进近终端区
    var appterMap = L.geoJSON(appter, {
        style: function (feature) {
            var obj = {
                color: "#1e50a2",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope;
            var opt = {
                permanent: true,
                className: "appter"
            };
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    });
    // 更新图层id
    appterMap['_leaflet_id'] = 'appterMap';
    layersGroup['appterMap'] = appterMap;

    //进近扇区
    var appsectorMap = L.geoJSON(appsector, {
        style: function (feature) {
            var obj = {
                color: "#59b9c6",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.verticalScope;
            var opt = {
                permanent: true,
                className: "appsector",
            };
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    });
    appsectorMap['_leaflet_id'] = 'appsectorMap';
    // 更新图层id
    layersGroup['appsectorMap'] = appsectorMap;
    //机场点
    var airpointMap = L.geoJSON(airpoint, {
        // 添加机场图标
        pointToLayer: function (geoJsonPoint, latlng) {
            if (geoJsonPoint.properties.type != '军用机场' && geoJsonPoint.properties.type != '军用备降机场') {
                return L.marker(latlng, {
                    icon: L.icon({
                        iconUrl: "img/ap.png",
                        iconSize: [18, 18],
                    }),
                    rotationAngle: -45//图标旋转角
                });
            }
        },
        style: function (feature) {
            var obj = {
                color: "#32adcc",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties.type != '军用机场' && feature.properties.type != '军用备降机场') {
                var title = feature.properties.identifier;
                if(title == ''){
                    title = feature.properties.name;
                }
                var opt = {
                    permanent: true,
                    className: "apName"
                };
                // 更新图层id
                layer['_leaflet_id'] = feature.properties.identifier;
                layer.bindTooltip(title, opt);
                layer.closeTooltip();
            }
        }
    });
    // 更新图层id
    airpointMap['_leaflet_id'] = 'airpointMap';
    layersGroup['airpointMap'] = airpointMap;
    //跑道
    var runwayMap = L.geoJSON(runway, {
        style: function (feature) {
            var obj = {
                color: "#008000",
                fillColor: "green",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.runwayName
            var opt = {
                permanent: true,
                direction:'top',
                className: "apName"
            };
            // 更新图层id
            layer._leaflet_id = feature.properties.enName + '_' + feature.properties.runwayName;
            layer['multFlight'] = false;
            //绑定title
            layer.bindTooltip(title, opt);
        }
    });
    // 更新图层id
    runwayMap['_leaflet_id'] = 'runwayMap';
    layersGroup['runwayMap'] = runwayMap;
    //航路点
    var waypointMap = L.tileLayer.wms(ipHost, {
        layers: 'chinaosm:waypoint',
        format: 'image/png8'
    });
    // 更新图层id
    waypointMap['_leaflet_id'] = 'waypointMap';
    layersGroup['waypointMap'] = waypointMap;

    //情报区
    var firMap = L.geoJSON(fir, {
        style: function (feature) {
            var obj = {
                color: "pink",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + feature.properties.cnName;
            var opt = {
                permanent: true,
                class: 'fir'
            };
            // 更新图层id
            layer['_leaflet_id'] = feature.properties.name;
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    });
    // 更新图层id
    firMap['_leaflet_id'] = 'firMap';
    layersGroup['firMap'] = firMap;
    //管制区
    var accMap = L.geoJSON(acc, {
        style: function (feature) {
            var obj = {
                color: "#165e83",
                fillColor: "transparent",
                weight: 1
            };
            return obj;
        },
        onEachFeature: function (feature, layer) {
            var title = feature.properties.name + "管制区";
            var opt = {
                permanent: true,
                className: "acc"
            };
            layer.bindTooltip(title, opt);
            layer.closeTooltip();
        }
    });
    // 更新图层id
    accMap['_leaflet_id'] = 'accMap';
    layersGroup['accMap'] = accMap;

    //设置经纬网显示
    var options = {
        interval: 20,
        showOriginLabel: false,
        redraw: 'move',
        zoomIntervals: [
            {start: 2, end: 2, interval: 40},
            {start: 3, end: 3, interval: 20},
            {start: 4, end: 4, interval: 10},
            {start: 5, end: 7, interval: 5},
            {start: 8, end: 20, interval: 1}
        ]};
    var gridLayer =  L.simpleGraticule(options);
    gridLayer['_leaflet_id'] = 'gridLayer';
    layersGroup['gridLayer'] = gridLayer;
    return{
        layersGroup:layersGroup,
    }
}();