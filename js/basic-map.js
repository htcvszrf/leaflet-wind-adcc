var initMap = (function () {
    var ipHost = "http://192.168.243.41:7070/geoserver/gwc/service/wms";
    var flightIphost = "http://192.168.243.41:8286/AIRPORT/FlightDynamicData";//航班数据ip
    var flightArr = [];//保存航班图层
    var isFlightRefresh = true;//飞行航班数据是否刷新
    var refreshTime = 1000 * 4;//飞行航班数据刷新时间
    var flyTimer;//航班定时器
    var layersId;
    var mainMap = L.map("main", {
        crs: L.CRS.EPSG4326,
        minZoom:3
    });
    //设置地图中心视角
    mainMap.setView([30.578333,103.946944], 13);
    // var airwayMap = L.tileLayer.wms("http://192.168.243.67:3619/geoserver/gwc/service/wms", {layers: 'china-osm:ne_10m_populated_places', format: 'image/png8'}).addTo(mainMap);
    //绑定地图缩放事件
    var bound = {
        northEast:mainMap.getBounds()['_northEast'],
        southWest:mainMap.getBounds()['_southWest'],
        mapZoomNum:mainMap.getZoom()//当前视图范围以及缩放等级
    };
    //地图缩放事件
    mainMap.on("zoomend",function(){
        // 更新边界数据
        bound = {
            northEast:mainMap.getBounds()['_northEast'],
            southWest:mainMap.getBounds()['_southWest'],
            mapZoomNum:mainMap.getZoom()
        };
        //更新缩放等级
        mapZoomNum = mainMap.getZoom();
        // getFlightData(false,bound)
        console.log(bound)
        console.log(mapZoomNum)
    })
    //绑定地图拖拽事件
    mainMap.on("moveend",function(){
        //更新边界数据
        bound = {
            northEast:mainMap.getBounds()['_northEast'],
            southWest:mainMap.getBounds()['_southWest'],
            mapZoomNum:mainMap.getZoom()
        };
        //更新缩放等级
        mapZoomNum = mainMap.getZoom();
        // getFlightData(false,bound)
        console.log(bound)
        console.log(mapZoomNum)
    })
    //地图详细街道
    var openmap = L.tileLayer.wms(ipHost, {
        layers: 'chinaosm:osm',
        format: 'image/png8',

    });
    //中国轮廓图
    var chinaBorder = L.geoJSON(china, {
        style: function (feature) {
            return {
                color: "#c5c5c5",
                fillColor: "transparent",
                weight: 0.8
                // fillOpacity:1
            };
        }
    }).addTo(mainMap);
    //边境地图
    var border4 = L.geoJSON(bd4, {
        style: function (feature) {
            return {
                color: "#c5c5c5",
                fillColor: "transparent",
                weight: 0.8
                // fillOpacity:1
            };
        }
    }).addTo(mainMap);
    //边境地图
    var border3 = L.geoJSON(bd3, {
        style: function (feature) {
            return {
                color: "#c5c5c5",
                fillColor: "transparent",
                weight: 0.8
                // fillOpacity:1
            };
        }
    }).addTo(mainMap);

    /**
     * 图层文字显示控制器
     * @param obj 图层对象
     */
    var controlMapsFunc = function (obj) {
        //获取当前缩放层级
        var zoomIndex = mainMap.getZoom();
        if ($.isArray(obj)) {
            //遍历每个图层
            $.each(obj, function (index, e) {
                layerShowRule(e, zoomIndex)
            });
        } else {
            // 单图层
            layerShowRule(obj, zoomIndex)
        }
    };
    /**
     * 图层title显示规则
     * @param layer
     * @param zoomIndex
     */
    var layerShowRule = function (layer, zoomIndex) {
        //排除航路和航路点和经纬网图层
        if (layer['_leaflet_id'] != 'airwayMap' && layer['_leaflet_id'] != 'waypointMap' && layer['_leaflet_id'] != 'gridLayer') {
            //管制区情报区显示规则
            if (layer['_leaflet_id'] == 'firMap' || layer['_leaflet_id'] == 'accMap') {
                if (zoomIndex * 1 <= 7) {
                    // 缩放层级小于7  显示文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.openTooltip();
                        });
                    }
                } else if (zoomIndex * 1 > 7) {
                    // 缩放层级大于7 隐藏文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.closeTooltip();
                        });
                    }
                }
            } else {
                // 缩放层级大于7 显示文字
                if (zoomIndex * 1 >= 7) {
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.openTooltip();
                        });
                    }
                } else if (zoomIndex * 1 < 7) {
                    // 缩放层级小于7 隐藏文字
                    if (mainMap.hasLayer(layer)) {
                        layer.eachLayer(function (L) {
                            L.closeTooltip();
                        });
                    }

                }
            }
        }
    }
    //定义图层
    var baseMapLaysers = {
        中国: chinaBorder
    };
    /**
     * 设置图层控制
     */
    var setLayerControl = function () {
        //获取aip图层组
        var layers = AipMap.layersGroup;
        var layersArr = [];
        //绑定到图层添加事件控制title显示
        $.each(layers, function (index, aipLayer) {
            aipLayer.on("add", function () {
                controlMapsFunc(aipLayer)
            });
            aipLayer.on("add", function () {
                controlMapsFunc(aipLayer)
            });
            aipLayer.on("zoomend", function () {
                aipLayer(layersArr)
            })
            layersArr.push(aipLayer);
        });
        //绑定到缩放事件控制title显示
        mainMap.on("zoomend", function () {
            controlMapsFunc(layersArr)
        })
        //添加图层控制
        var layerControl = L.control.layers(baseMapLaysers);
        layerControl.addTo(mainMap);
        layerControl.addOverlay(openmap, "街道");
        layerControl.addOverlay(layers.gridLayer, "经纬网格");
        layerControl.addOverlay(layers.secMap, "扇区");
        var airports = L.featureGroup([layers.runwayMap, layers.airpointMap]);
        layerControl.addOverlay(airports, "机场");
        // layerControl.addOverlay(velocityLayer, "风向图");
        layerControl.addOverlay(layers.accMap, "管制区");
        layerControl.addOverlay(layers.appsectorMap, "进近扇区");
        layerControl.addOverlay(layers.appterMap, "进近终端区");
        // layerControl.addOverlay(heatLayer, "热力图");
        layerControl.addOverlay(layers.airwayMap, '航路');
        layerControl.addOverlay(layers.firMap, '情报区');
        layerControl.addOverlay(layers.waypointMap, "航路点");
    }

    /**
     * 定时器
     * @param func
     * @param isNext
     * @param time
     */
    var startTimer = function (func,isNext,lonData, time,timer) {
        // 清除定时器
        clearTimeout(timer);
        if (typeof func == "function") {
            timer = setTimeout(function () {
                func(isNext,lonData);
            }, time);
        }
    };
    /**
     * 获取飞行航班数据
     * @param isFlightRefresh
     */
    var getFlightData = function(isFlightRefresh,lonData){
        var dataReusult = JSON.stringify(lonData);
            $.ajax({
                url: flightIphost,
                type: "post",
                data: {
                    str:dataReusult
                },
                success:function(data){
                    if($.isValidObject(data)&&data.status == 200){
                        if($.isValidObject(data.flight)) {
                            //移除上次绘制图层
                            if(flightArr.length>0){
                                flightMove.removeFlight(flightArr);
                            }
                            //绘制航班图层
                            flightArr = flightMove.drawFlight(data.flight,mainMap,AipMap.layersGroup.runwayMap).unFlyFlightArr;
                            for(var i=0;i<flightArr.length;i++){
                                if(mainMap.layerSelectId){
                                    if(flightArr[i]._leaflet_id == mainMap.layerSelectId){
                                        flightArr[i].openPopup();
                                    }
                                }
                            }
                            //开启定时
                            if(isFlightRefresh){
                                startTimer(getFlightData,isFlightRefresh, bound,refreshTime,flyTimer);
                            }
                        }
                    }else if(data.status == 500){
                        startTimer(getFlightData,isFlightRefresh, bound,refreshTime,flyTimer);
                        console.warn(data.error.message)
                    }
                },
                error: function (xhr, status, error) {
                    clearInterval(flyTimer);
                    startTimer(getFlightData,isFlightRefresh, bound,refreshTime,flyTimer);
                    console.warn(error)
                }
            })
    }
    //气象数据显示暂时屏蔽
    // //风向图层
    // var velocityLayer = L.velocityLayer({
    //   displayValues: true,
    //   displayOptions: {
    //     velocityType: "风向图",
    //     displayPosition: "bottom left",
    //     displayEmptyString: "No wind data"
    //   },
    //   data: wind,
    //   maxVelocity: 10
    // }).on("add", function() {});
    //
    // //热力图层
    // var cfg = {
    //   radius: 1.5, //设置每一个热力点的半径
    //   maxOpacity: 0.9, //设置最大的不透明度
    //   // minOpacity: 0.3,     //设置最小的不透明度
    //   scaleRadius: true, //设置热力点是否平滑过渡
    //   blur: 0.95, //系数越高，渐变越平滑，默认是0.85,
    //   //滤镜系数将应用于所有热点数据。
    //   useLocalExtrema: true, //使用局部极值
    //   latField: "lat", //维度
    //   lngField: "lng", //经度
    //   valueField: "value", //热力点的值
    //   gradient: {
    //     "0.99": "rgba(255,0,0,.5)",
    //     "0.9": "rgba(255,255,0,1)",
    //     "0.8": "rgba(0,255,0,1)",
    //     "0.5": "rgba(0,255,255,1)",
    //     "0": "rgba(0,0,255,1)"
    //   }, //过渡，颜色过渡和过渡比例
    //   backgroundColor: "rgba(27,34,44,0.5)" //热力图Canvas背景
    // };
    // var testData = {
    //   max: 10,
    //   data: [
    //     { lat: 40.07222222222222, lng: 116.59722222222221, value: 10 },
    //     { lat: 39.07222222222222, lng: 117.00722222222221, value: 10 }
    //   ]
    // };
    // //热力图层
    // var heatLayer = new HeatmapOverlay(cfg).on("add", function() {
    //   $(".video").show();
    // }).on("remove", function() {
    //   $(".video").hide();
    // });
    // heatLayer.setData(testData);
    // //初始化时间选择器
    // var currentDate = new Date();
    // var startDate = parseInt($.getFullTime(currentDate).substring(0, 8) + "0000");
    // var endDate = parseInt($.getFullTime(currentDate).substring(0, 8) + "2359");
    // $(".range-slider").jRange({
    //   from: startDate,
    //   to: endDate,
    //   step: 100,
    //   scale: [
    //     "00:00",
    //     "01:00",
    //     "02:00",
    //     "03:00",
    //     "04:00",
    //     "05:00",
    //     "06:00",
    //     "07:00",
    //     "08:00",
    //     "09:00",
    //     "10:00",
    //     "11:00",
    //     "12:00",
    //     "13:00",
    //     "14:00",
    //     "15:00",
    //     "16:00",
    //     "17:00",
    //     "18:00",
    //     "19:00",
    //     "20:00",
    //     "21:00",
    //     "22:00",
    //     "23:00"
    //   ],
    //   format: function(value, pointer) {
    //     return $.formatTimeDDHHMM(value + "");
    //   },
    //   onbarclicked:function () {
    //     var value = $(".range-slider").jRange("getValue")
    //     if(value != NaN){
    //       heatLayer.setData(heatMapData[value]);
    //     }
    //   },
    //   ondragend:function () {
    //     var value = $(".range-slider").jRange("getValue")
    //     if(value != NaN){
    //       heatLayer.setData(heatMapData[value]);
    //     }
    //   },
    //   width: 800,
    //   showLabels: true,
    //   snap: true
    // });
    // $(".play-heat").on("click", function() {
    //   initHeatAnimation();
    // });
    // var heatMapData = {
    //   201805230000: {
    //     max: 10,
    //     data: [
    //       { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 ,radius:0.1},
    //       { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 ,radius:100}
    //     ]
    //   },
    //   201805230100: {
    //     max: 10,
    //     data: [
    //       { lat: 41.07222222222222, lng: 117.59722222222221, value: 100 ,radius:0.2},
    //       { lat: 38.07222222222222, lng: 115.00722222222221, value: 100 ,radius:0.02}
    //     ]
    //   },
    //   201805230200: {
    //     max: 10,
    //     data: [
    //       { lat: 42.07222222222222, lng: 118.59722222222221, value: 100 },
    //       { lat: 36.07222222222222, lng: 113.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805230300: {
    //     max: 10,
    //     data: [
    //       { lat: 45.07222222222222, lng: 120.59722222222221, value: 100 },
    //       { lat: 30.07222222222222, lng: 110.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805230400: {
    //     max: 10,
    //     data: [
    //       { lat: 42.07222222222222, lng: 120.59722222222221, value: 100 },
    //       { lat: 35.07222222222222, lng: 105.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805230500: {
    //     max: 10,
    //     data: [
    //       { lat: 30.691667, lng: 106.101667, value: 100 },
    //       { lat: 37.034444, lng: 79.869167, value: 100 }
    //     ]
    //   },
    //   201805230600: {
    //     max: 10,
    //     data: [
    //       { lat: 31.156944, lng: 107.44, value: 100 },
    //       { lat: 36.638333, lng: 109.605, value: 100 }
    //     ]
    //   },
    //   201805230700: {
    //     max: 10,
    //     data: [
    //       { lat: 28.428611, lng: 115.921944, value: 100 },
    //       { lat: 27.8616672, lng: 109.293333, value: 100 }
    //     ]
    //   },
    //   201805230800: {
    //     max: 10,
    //     data: [
    //       { lat: 41.266667, lng: 80.228333, value: 100 },
    //       { lat: 31.589444, lng: 120.319444, value: 100 }
    //     ]
    //   },
    //   201805230900: {
    //     max: 10,
    //     data: [
    //       { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
    //       { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805231000: {
    //     max: 10,
    //     data: [
    //       { lat: 43.908889, lng: 87.473056, value: 100 },
    //       { lat: 21.861667, lng: 100.935556, value: 100 }
    //     ]
    //   },
    //   201805231100: {
    //     max: 10,
    //     data: [
    //       { lat: 36.401667, lng: 94.881667, value: 100 },
    //       { lat: 30.255, lng: 121.220278, value: 100 }
    //     ]
    //   },
    //   201805231200: {
    //     max: 10,
    //     data: [
    //       { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
    //       { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805231300: {
    //     max: 10,
    //     data: [
    //       { lat: 35.758333, lng: 107.645, value: 100 },
    //       { lat: 24.409722, lng: 98.538056, value: 100 }
    //     ]
    //   },
    //   201805231400: {
    //     max: 10,
    //     data: [
    //       { lat: 38.149444, lng: 85.534444, value: 100 },
    //       { lat: 28.799444, lng: 104.555556, value: 100 }
    //     ]
    //   },
    //   201805231500: {
    //     max: 10,
    //     data: [
    //       { lat: 30.523056, lng: 97.14, value: 100 },
    //       { lat: 40.148333, lng: 94.708333, value: 100 }
    //     ]
    //   },
    //   201805231600: {
    //     max: 10,
    //     data: [
    //       { lat: 34.276944, lng: 117.999167, value: 100 },
    //       { lat: 25.644167, lng: 100.324722, value: 100 }
    //     ]
    //   },
    //   201805231700: {
    //     max: 10,
    //     data: [
    //       { lat: 32.672222, lng: 118.579167, value: 100 },
    //       { lat: 34.555, lng: 108.63, value: 100 }
    //     ]
    //   },
    //   201805231800: {
    //     max: 10,
    //     data: [
    //       { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
    //       { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
    //     ]
    //   },
    //   201805231900: {
    //     max: 10,
    //     data: [
    //       { lat: 34.600278, lng: 108.916389, value: 100 },
    //       { lat: 34.431667, lng: 108.728333, value: 100 }
    //     ]
    //   },
    //   201805232000: {
    //     max: 10,
    //     data: [
    //       { lat: 36.528056, lng: 102.031389, value: 100 },
    //       { lat: 30.886667, lng: 120.416667, value: 100 }
    //     ]
    //   },
    //   201805232100: {
    //     max: 10,
    //     data: [
    //       { lat: 28.852778, lng: 105.385556, value: 100 },
    //       { lat: 46.66, lng: 83.37, value: 100 }
    //     ]
    //   },
    //   201805232200: {
    //     max: 10,
    //     data: [
    //       { lat: 29.631667, lng: 105.756667, value: 100 },
    //       { lat: 29.765, lng: 119.658333, value: 100 }
    //     ]
    //   },
    //   201805232300: {
    //     max: 10,
    //     data: [
    //       { lat: 22.646667, lng: 113.801667, value: 100 },
    //       { lat: 29.764444, lng: 119.658333, value: 100 }
    //     ]
    //   }
    // };
    // //初始化热力图动画
    // var initHeatAnimation = function() {
    //   var isPlay = eval($(".play-heat").attr("isPlay"));
    //   var timer;
    //   if (!isPlay) {
    //     //播放
    //     $(".play-heat").removeClass("glyphicon-play");
    //     $(".play-heat").addClass("glyphicon-pause");
    //     $(".play-heat").attr("isPlay", true);
    //     playAnimation(true);
    //   } else {
    //     //暂停
    //     $(".play-heat").removeClass("glyphicon-pause");
    //     $(".play-heat").addClass("glyphicon-play");
    //     $(".play-heat").attr("isPlay", false);
    //     playAnimation(false);
    //   }
    // };
    // //热力图动画播放
    // var playAnimation = function(isPlay) {
    //   var currentValue = $(".range-slider").jRange("getValue");
    //   var setValue = currentValue * 1 + 100 + "";
    //   var startDate = ($.getFullTime(currentDate).substring(0, 8) + "0000");
    //   var endDate = ($.getFullTime(currentDate).substring(0, 8) + "2400");
    //   if (isPlay) {
    //     if (setValue == endDate) {
    //       $(".range-slider").jRange("setValue", startDate);
    //       heatLayer.setData(heatMapData[startDate]);
    //     } else {
    //       $(".range-slider").jRange("setValue", setValue);
    //       heatLayer.setData(heatMapData[setValue]);
    //     }
    //     timer = setTimeout(function() {
    //       playAnimation(isPlay);
    //     }, 1000);
    //   } else {
    //     clearTimeout(timer);
    //   }
    // };
    return {
        init: function () {
            setLayerControl();
            getFlightData(isFlightRefresh,bound);
        },
        mainMaps:mainMap
    }
})();
$(document).ready(function () {
    initMap.init();
})