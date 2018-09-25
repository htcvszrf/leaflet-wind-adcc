var initMap = (function () {
    var ipHost = "http://192.168.243.8:7070/geoserver/gwc/service/wms";
    var flightIphost = "http://192.168.243.8:8286/AIRPORT/FlightDynamicData"; //航班数据ip
    var flightArr = []; //保存航班图层
    var distanceArr = []; //保存跑道末端距离
    var isFlightRefresh = false; //飞行航班数据是否刷新
    var refreshTime = 1000 * 4; //飞行航班数据刷新时间
    var flightHeat; //航班密度图层
    //航班密度图参数
    var flightOptions = {
        maxZoom: 5,
        blur: 15,
        radius: 10
    }
    var flyTimer; //航班定时器
    var mainMap = L.map("main", {
        minZoom: 3,//设置最小缩放等级
        // maxZoom: 10,//设置最小缩放等级
        maxBounds: [
            [82.69865866056999, 272.28515625000006],
            [-8.754794702435618, -65.21484375000001]
        ],//设置缩放范围
    });
    //添加比例尺显示(海里)
    mainMap.addControl(new L.Control.ScaleNautic({
        metric: false,//km
        imperial: false,//英里
        nautic: true//海里
    }));
//设置地图中心视角
    mainMap.setView([40.072222, 116.597222], 5);
//绑定地图缩放事件
    var bound = {
        northEast: mainMap.getBounds()['_northEast'],
        southWest: mainMap.getBounds()['_southWest'],
        mapZoomNum: mainMap.getZoom() //当前视图范围以及缩放等级
    };
//地图缩放事件
    mainMap.on("zoomend", function () {
        // 更新边界数据
        bound = {
            northEast: mainMap.getBounds()['_northEast'],
            southWest: mainMap.getBounds()['_southWest'],
            mapZoomNum: mainMap.getZoom()
        };
        //更新缩放等级
        mapZoomNum = mainMap.getZoom();
        // getFlightData(false,bound)
        console.log(bound)
        console.log(mapZoomNum)
        if ($.isValidObject(flightHeat)) {
            if (mapZoomNum <= 5) {
                flightOptions.maxZoom =5
                flightOptions.radus = getPxtoNm()
                flightHeat.setOptions({
                    maxZoom: 5,
                    radius: getPxtoNm()
                });
            } else if (mapZoomNum > 5 && mapZoomNum < 8) {
                flightOptions.maxZoom = 9
                flightHeat.setOptions({
                    maxZoom: 9,
                    radius: getPxtoNm()
                });
            } else if (mapZoomNum >= 8 && mapZoomNum < 12) {
                flightOptions.maxZoom = 11
                flightOptions.radus = getPxtoNm()
                flightHeat.setOptions({
                    maxZoom: 11,
                    radius: getPxtoNm()
                });
            } else if (mapZoomNum >= 12) {
                flightOptions.maxZoom = 15
                flightOptions.radus = getPxtoNm()
                flightHeat.setOptions({
                    maxZoom: 15,
                    radius: getPxtoNm()
                });
            }
        }
    })
    //绑定地图拖拽事件
    mainMap.on("moveend", function () {
        //更新边界数据
        bound = {
            northEast: mainMap.getBounds()['_northEast'],
            southWest: mainMap.getBounds()['_southWest'],
            mapZoomNum: mainMap.getZoom()
        };
        //更新缩放等级
        mapZoomNum = mainMap.getZoom();
        // getFlightData(false,bound)
        console.log(bound)
        console.log(mapZoomNum);
    })
    //地图详细街道(加载wms瓦片)
    var openmap = L.tileLayer.wms(ipHost, {
        layers: 'chinaosm:osm',
        format: 'image/png8',
    });
    //雷达回波图图初始化
    var config = {
        radius: 0.05,       //设置每一个热力点的半径
        maxOpacity: 0.9,        //设置最大的不透明度
        minOpacity: 0.3,     //设置最小的不透明度
        scaleRadius: true,      //设置热力点是否平滑过渡
        blur: 0.95,             //系数越高，渐变越平滑，默认是0.85,
        useLocalExtrema: true,  //使用局部极值
        latField: 'lat',//纬度
        valueField: 'grade',//热力点值
        lngField: 'lon',//经度
        gradient: {
            "1.0": 'rgb(173,144,240)',
            "0.80": 'rgb(173,144,240)',
            "0.70": 'rgb(173,144,240)',
            "0.65": 'rgb(150,0,180)',
            "0.60": 'rgb(255,0,240)',
            "0.55": 'rgb(192,0,0)',
            "0.50": 'rgb(214,0,0)',
            "0.45": 'rgb(255,0,0)',
            "0.40": 'rgb(255,144,0)',
            "0.35": 'rgb(231,192,0)',
            "0.30": 'rgb(255,255,0)',
            "0.25": 'rgb(1,144,0)',
            "0.20": 'rgb(0,216,0)',
            "0.15": 'rgb(0, 236, 236)',
            "0.10": 'rgb(1, 160, 246)',
            "0.0": 'rgba(255, 255, 255,0)'
        }//热力图颜色值
    }
    //初始化雷达回拨图层
    // var heatmapLayer = new HeatmapOverlay(config);
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
     * 部分图层title显示规则
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
        中国: chinaBorder,
    };
    var blockMap = {
        街道: openmap,
    }
    /**
     * 设置图层控制
     */
    var setLayerControl = function () {
        //获取aip图层组
        var layers = AipMap.layersGroup;
        var layersArr = [];
        //绑定到图层添加事件控制title显示
        $.each(layers, function (index, aipLayer) {
            //显示事件
            aipLayer.on("add", function () {
                controlMapsFunc(aipLayer)
            });
            //缩放事件
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
        layerControl.addOverlay(layers.runwayMap, "跑道");
        layerControl.addOverlay(layers.airpointMap, "机场");
        layerControl.addOverlay(velocityLayer, "风向图");
        // layerControl.addOverlay(heatmapLayer, "云图");
        layerControl.addOverlay(layers.accMap, "管制区");
        layerControl.addOverlay(layers.appsectorMap, "进近扇区");
        layerControl.addOverlay(layers.appterMap, "进近终端区");
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
    var startTimer = function (func, isNext, lonData, time, timer) {
        // 清除定时器
        clearTimeout(timer);
        if (typeof func == "function") {
            timer = setTimeout(function () {
                func(isNext, lonData);
            }, time);
        }
    };
    /**
     * 获取飞行航班数据
     * @param isFlightRefresh
     */
    var getFlightData = function (isFlightRefresh, lonData) {
        //json化参数
        var dataReusult = JSON.stringify(lonData);
        $.ajax({
            url: flightIphost,
            type: "POST",
            data: {
                str: dataReusult
            },
            success: function (data) {
                if ($.isValidObject(data) && data.status == 200) {
                    if ($.isValidObject(data.flight)) {
                        // 移除上次绘制图层
                        // if (flightArr.length > 0) {
                        //     // 移除上次绘制航班图层
                        //     flightMove.removeFlight(flightArr, distanceArr, mainMap);
                        //     mainMap.flightLayers.clearLayers();
                        //     // 移除上次绘制跑道样式图层
                        //     flightMove.removeRunwayStyle(AipMap.layersGroup.runwayMap)
                        //     //数据置空
                        //     flightArr = [];
                        //     distanceArr = [];
                        // }
                        // // 绘制航班图层
                        // flightArr = flightMove.drawFlight(data.flight, mainMap).unFlyFlightArr;
                        // // 绘制跑道到末端距离
                        // distanceArr = flightMove.drawRunwayStatus(data.flight, mainMap, AipMap.layersGroup.runwayMap).rwyDistanceArr;
                        //绘制航班热力图显示
                        flightHeatMap(data)
                        //开启定时
                        if (isFlightRefresh) {
                            startTimer(getFlightData, isFlightRefresh, bound, refreshTime, flyTimer);
                        }
                    }
                } else if (data.status == 500) {
                    startTimer(getFlightData, isFlightRefresh, bound, refreshTime, flyTimer);
                    console.warn(data.error.message)
                }
            },
            error: function (xhr, status, error) {
                clearInterval(flyTimer);
                startTimer(getFlightData, isFlightRefresh, bound, refreshTime, flyTimer);
                console.warn(error)
            }
        })
    }
    /**
     * 获取10海里对应的像素值
     * @returns {number}
     */
    var getPxtoNm = function () {
        var num = 5 * parseInt($('.leaflet-control-scale-line').outerWidth()) / $('.leaflet-control-scale-line').html().split('nm')[0] * 1;
        return num
    }
    /**
     * 初始化时间选择器
     */
    var initDatePicke = function () {
        // 起始时间输入框
        $(' .start-date-input').datetimepicker({
            language: "zh-CN",
            weekStart: 1,
            todayBtn: false,
            autoclose: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: "yyyy-mm-dd", // 选择时间
            pickerPosition: 'bottom-left'
        });
        // 截止时间输入框
        $(' .end-date-input').datetimepicker({
            language: "zh-CN",
            weekStart: 1,
            todayBtn: false,
            autoclose: 1,
            startView: 2,
            minView: 2,
            forceParse: 0,
            format: "yyyy-mm-dd", // 选择时间
            pickerPosition: 'bottom-left'
        });
    }

    /**
     * 初始化动态航班播放
     */
    var intitPlay = function () {
        $('.play-flight').on('click', function () {
            if ($(this).attr('isPlay') == "false") {
                $(this).html("暂停航班动态航班信息")
                isFlightRefresh = true;
                if (isFlightRefresh) {
                    getFlightData(isFlightRefresh, bound);
                }
                $(this).attr('isPlay', 'true');
            } else {
                isFlightRefresh = false;
                $(this).html("显示航班动态航班信息")
                $(this).attr('isPlay', 'false');
            }
        })
    }
    /**
     * 航班密度热力图显示
     */
    var flightHeatMap = function (data) {
        var dataArr = [];
        // 遍历航班数据存储经纬度值
        if ($.isValidObject(flightHeat)) {
            flightHeat.remove()
            dataArr = [];
        }
        $.each(data.flight, function (i, e) {
            if (e.height * 1 >= 50) {
                var arr = [];
                arr[0] = e.lat;
                arr[1] = e.lon;
                dataArr.push(arr)
            }
        })
        flightOptions.radus = getPxtoNm()
        var flightOption = {
            radius: flightOptions.radus,//圆形半径
            maxZoom: flightOptions.maxZoom,//最大缩放
            blur: 15,//模糊半径
            gradient: {
                0: '#FFFFFF',
                0.1: 'rgb(1, 160, 246)',
                0.2: '#7F95E6',
                0.3: 'rgb(1,144,0)',
                0.4: '#F6FD01',
                0.5: '#EF8C07',
                0.7: '#FE0409',
                1: 'rgb(214,0,0)'
            }//渐变色
        }
        flightHeat = L.heatLayer(dataArr, flightOption);
        var groupHeat = L.layerGroup([flightHeat]).addTo(mainMap)
    }
    /**
     * 初始化滑动栏
     */
    var initSlider = function () {
        $('.switch-panel').on('click', function () {
            switchSlider()
        })
    }
    /**
     * 切换滑动栏
     */
    var switchSlider = function () {
        if ($('.switch-panel').hasClass('glyphicon-arrow-right')) {
            $('.switch-panel').removeClass('glyphicon-arrow-right')
            $('.switch-panel').addClass('glyphicon-arrow-left')
            $("#main").animate({
                width: '100%'
            }, 'slow');
            $(".board").animate({
                right: '-20%'
            }, 'slow')
        } else {
            $('.switch-panel').removeClass('glyphicon-arrow-left')
            $('.switch-panel').addClass('glyphicon-arrow-right')
            $("#main").animate({
                width: '80%'
            }, 'slow');
            $(".board").animate({
                right: '0%'
            }, 'slow')
        }
    }
    //风向图层
    var velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
            velocityType: '亚洲风向数据展示',
            displayPosition: 'topleft',
            displayEmptyString: 'No wind data'
        },
        colorScale: ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"],
        data: wind,//grib2风向数据
        maxVelocity: 15
    });
    //雷达回波云层图层
    // $.ajax({
    //     url: 'http://192.168.243.41:8286/AIRPORT/HeatData',
    //     type: "GET",
    //     success: function (data) {
    //         var arr = [];
    //         $.each(data.heat, function (index, e) {
    //             var obj = {};
    //             obj['lat'] = e.lat;
    //             obj['lon'] = e.lon;
    //             obj["grade"] = e.grade;
    //             arr.push(obj);
    //         })
    //         var heatData = {
    //             'max': 100,
    //             'data': arr
    //         }
    //         // heatmapLayer.setData(heatData);
    //     }
    // })
    return {
        init: function () {
            setLayerControl();
            initDatePicke();
            intitPlay();
            initSlider();
            getFlightData(true, bound);
        },
        mainMaps: mainMap
    }
})
();
$(document).ready(function () {
    initMap.init();
})