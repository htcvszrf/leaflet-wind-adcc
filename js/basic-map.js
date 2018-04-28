var initMap = (function() {
  var mymap = L.map("main");
  // //中国轮廓图
  // var cnMap = L.geoJSON(china, {
  //     style: function (feature) {
  //         return {
  //             color: "#5c5c5c",
  //             fillColor: "#666",
  //             weight: 0.8
  //             // fillOpacity:1
  //         };
  //     }
  // }).addTo(mymap);
  // //边境地图
  // L.geoJSON(bd4, {
  //     style: function (feature) {
  //         return {
  //             color: "#5c5c5c",
  //             fillColor: "#ccc",
  //             weight: 0.8
  //             // fillOpacity:1
  //         };
  //     }
  // }).addTo(mymap);
  // //边境地图
  // L.geoJSON(bd3, {
  //     style: function (feature) {
  //         return {
  //             color: "#5c5c5c",
  //             fillColor: "#ccc",
  //             weight: 0.8
  //             // fillOpacity:1
  //         };
  //     }
  // }).addTo(mymap);
  /**
   * 控制器
   * @param obj 图层对象
   */
  var controlMapsFunc = function(obj) {
    var zoomIndex = mymap.getZoom();
    console.log(zoomIndex);
    if ($.isArray(obj)) {
      $.each(obj, function(i, e) {
        if (zoomIndex * 1 >= 7) {
          if (mymap.hasLayer(e)) {
            e.eachLayer(function(layer) {
              layer.openTooltip();
            });
          }
        } else if (zoomIndex * 1 < 7) {
          e.eachLayer(function(layer) {
            layer.closeTooltip();
          });
        }
      });
    } else {
      if (zoomIndex * 1 >= 7) {
        if (mymap.hasLayer(obj)) {
          obj.eachLayer(function(layer) {
            layer.openTooltip();
          });
        }
      } else if (zoomIndex * 1 < 7) {
        obj.eachLayer(function(layer) {
          layer.closeTooltip();
        });
      }
    }
    //判断机场是否显示条件
    // if (zoomIndex * 1 > 10) {
    //     if (!$.isEmptyObject(airportImg) && $.isValidObject(airportImg)) {
    //         airportImg.setOpacity(1);
    //     }
    // } else if (zoomIndex * 1 < 10) {
    //     console.log("hide");
    //     if ($.isEmptyObject(airportImg)) {
    //         return;
    //     } else if ($.isValidObject(airportImg)) {
    //         airportImg.setOpacity(0);
    //     }
    // }
    // if (
    //     zoomIndex * 1 == 10 &&
    //     $.isEmptyObject(airportImg) &&
    //     mymap.hasLayer(airpointMap)
    // ) {
    //     var url = "http://192.168.243.67:8080/img/beijingAirport/airport.png";
    //     imageBounds = [
    //         [
    //             40.07222222222222 - zoomIndex * 0.01,
    //             116.59722222222221 - zoomIndex * 0.009
    //         ],
    //         [
    //             40.07222222222222 + zoomIndex * 0.01,
    //             116.59722222222221 + zoomIndex * 0.009
    //         ]
    //     ];
    //     airportImg = L.imageOverlay(url, imageBounds).addTo(mymap);
    // }
  };

  var laysersMap = [];
  //扇区
  var secMap = L.geoJSON(sector, {
    style: function(feature) {
      var obj = {
        color: "#3333ff",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
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
  }).on("add", function() {
    controlMapsFunc(secMap);
  });
  laysersMap.push(secMap);

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
    style: function(feature) {
      var obj = {
        color: "#165e83",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
      var title = feature.properties.name + "管制区";
      var opt = {
        permanent: true,
        className: ""
      };
      layer.bindTooltip(title, opt);
      layer.closeTooltip();
    }
  }).on("add", function() {
    controlMapsFunc(accMap);
  });
  laysersMap.push(accMap);

  //进近终端区
  var appterMap = L.geoJSON(appter, {
    style: function(feature) {
      var obj = {
        color: "#1e50a2",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
      var title = feature.properties.name + feature.properties.verticalScope;
      var opt = {
        permanent: true,
        className: "appter"
      };
      layer.bindTooltip(title, opt);
      layer.closeTooltip();
    }
  }).on("add", function() {
    controlMapsFunc(appterMap);
  });
  laysersMap.push(appterMap);

  //进近扇区
  var appsectorMap = L.geoJSON(appsector, {
    style: function(feature) {
      var obj = {
        color: "#59b9c6",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
      var title = feature.properties.name + feature.properties.verticalScope;
      var opt = {
        permanent: true,
        className: "appsector"
      };
      layer.bindTooltip(title, opt);
      layer.closeTooltip();
    }
  }).on("add", function() {
    controlMapsFunc(appsectorMap);
  });
  laysersMap.push(appsectorMap);
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
    iconUrl: "img/airport.png",
    iconSize: [18, 18]
  });

  //机场点
  var airpointMap = L.geoJSON(airpoint, {
    // 添加机场图标
    pointToLayer: function(geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: airportIcon
      });
    },
    style: function(feature) {
      var obj = {
        color: "#32adcc",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
      var title = feature.properties.name;
      var opt = {
        permanent: true,
        className: "apName"
      };
      layer.bindTooltip(title, opt);
      layer.closeTooltip();
    }
  }).on("add", function() {
    controlMapsFunc(airpointMap);
  });
  laysersMap.push(airpointMap);
  //跑道
  var flStep = 0;
  var flightMove;
  var timer = '';
  var runwayMap = L.geoJSON(runway, {
    style: function(feature) {
      var obj = {
        color: "#0033ff",
        fillColor: "#0033ff",
        weight: 1
      };
      return obj;
    }
    // onEachFeature: function (feature, layer) {
    //     var title = feature.properties.name
    //     var opt = {
    //         permanent: true
    //     }
    //     layer.bindTooltip(title, opt)
    //     layer.closeTooltip();
    // }
  }).on("add", function() {
    controlMapsFunc(runwayMap);
    //添加航班标记(贵阳龙洞堡机场)
    var flightIcon =  L.divIcon({className: 'circle'})
    flightMove = L.marker([flightAinamtion[flStep].lat,flightAinamtion[flStep].lon],{
      icon: flightIcon
    }).addTo(mymap)
      initAnimation();
  });
  //初始化航班动画
  var initAnimation = function () {
    // 定时器
    timer = setTimeout(function () {
      flStep++;
      flightMove.setLatLng([flightAinamtion[flStep].lat,flightAinamtion[flStep].lon]);
      initAnimation();
      if(flStep == 12){
        flStep = 0;
      }
    },2000)
  };
  laysersMap.push(runwayMap);
  //合并机场点和跑道
  var airports = L.featureGroup([runwayMap, airpointMap]);

  // 航路点图标
  var waypointIcon = L.icon({
    iconUrl: "img/waypoint.png",
    iconSize: [18, 18]
  });
  //航路点
  var waypointMap = L.geoJSON(waypoint, {
    // 添加机场图标
    pointToLayer: function(geoJsonPoint, latlng) {
      return L.marker(latlng, {
        icon: waypointIcon
      });
    },
    style: function(feature) {
      var obj = {
        color: "#32adcc",
        fillColor: "transparent",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function(feature, layer) {
      if ($.isValidVariable(feature.properties.identifier)) {
        var title =
          feature.properties.identifier + "-" + feature.properties.name;
      } else {
        var title = feature.properties.name;
      }
      var opt = {
        permanent: true,
        className: "airwaypoint"
      };
      layer.bindTooltip(title, opt);
      layer.closeTooltip();
    }
  }).on("add", function() {
    controlMapsFunc(waypointMap);
  });
  laysersMap.push(waypointMap);
  //设置地图中心视角
  mymap.setView([40, 100], 4);

  // 北京机场底图
  // var airportImg = "";
  //放大缩小控制器
  mymap.on("zoomend", function() {
    controlMapsFunc(laysersMap);
  });

  //风向图层
  var velocityLayer = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType: "风向图",
      displayPosition: "bottom left",
      displayEmptyString: "No wind data"
    },
    data: wind,
    maxVelocity: 10
  }).on("add", function() {});

  //热力图层
  var cfg = {
    radius: 1.5, //设置每一个热力点的半径
    maxOpacity: 0.9, //设置最大的不透明度
    // minOpacity: 0.3,     //设置最小的不透明度
    scaleRadius: true, //设置热力点是否平滑过渡
    blur: 0.95, //系数越高，渐变越平滑，默认是0.85,
    //滤镜系数将应用于所有热点数据。
    useLocalExtrema: true, //使用局部极值
    latField: "lat", //维度
    lngField: "lng", //经度
    valueField: "count", //热力点的值
    gradient: {
      "0.99": "rgba(255,0,0,.5)",
      "0.9": "rgba(255,255,0,1)",
      "0.8": "rgba(0,255,0,1)",
      "0.5": "rgba(0,255,255,1)",
      "0": "rgba(0,0,255,1)"
    }, //过渡，颜色过渡和过渡比例
    backgroundColor: "rgba(27,34,44,0.5)" //热力图Canvas背景
  };
  var testData = {
    max: 10,
    data: [
      { lat: 40.07222222222222, lng: 116.59722222222221, count: 100 },
      { lat: 39.07222222222222, lng: 117.00722222222221, count: 100 }
    ]
  };
  

  
  
  
  
  
  
  //热力图层
  var heatLayer = new HeatmapOverlay(cfg)
    .on("add", function() {
      $(".video").show();
    })
    .on("remove", function() {
      $(".video").hide();
    });
  heatLayer.setData(testData);
  //加载网络地图
  var normalm = L.tileLayer.chinaProvider("TianDiTu.Normal.Map", {
      maxZoom: 18,
      minZoom: 5
    }),
    normala = L.tileLayer.chinaProvider("TianDiTu.Normal.Annotion", {
      maxZoom: 18,
      minZoom: 5
    }),
    imgm = L.tileLayer.chinaProvider("TianDiTu.Satellite.Map", {
      maxZoom: 18,
      minZoom: 5
    }),
    imga = L.tileLayer.chinaProvider("TianDiTu.Satellite.Annotion", {
      maxZoom: 18,
      minZoom: 5
    });

  var openmap = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{foo: 'bar'}).addTo(mymap)

//   var normal = L.layerGroup([normalm, normala]).addTo(mymap);
//   var image = L.layerGroup([imgm, imga]).addTo(mymap);
  //定义图层
  var baseMapLaysers = {
    中国: openmap
  };
  //添加图层控制
  var layerControl = L.control.layers(baseMapLaysers);
  layerControl.addTo(mymap);
  layerControl.addOverlay(secMap, "扇区");
  // layerControl.addOverlay(runwayMap, '跑道');
  layerControl.addOverlay(airports, "机场");
  layerControl.addOverlay(velocityLayer, "风向图");
  // layerControl.addOverlay(airwayMap, '航路');
  layerControl.addOverlay(accMap, "管制区");
  layerControl.addOverlay(appsectorMap, "进近扇区");
  layerControl.addOverlay(appterMap, "进近终端区");
  // layerControl.addOverlay(firMap, '情报区');
  layerControl.addOverlay(waypointMap, "航路点");
  layerControl.addOverlay(heatLayer, "热力图");
  
  //初始化时间选择器
  var currentDate = new Date();
  var startDate = parseInt($.getFullTime(currentDate).substring(0, 8) + "0000");
  var endDate = parseInt($.getFullTime(currentDate).substring(0, 8) + "2359");
  $(".range-slider").jRange({
    from: startDate,
    to: endDate,
    step: 100,
    scale: [
      "00:00",
      "01:00",
      "02:00",
      "03:00",
      "04:00",
      "05:00",
      "06:00",
      "07:00",
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00"
    ],
    format: function(value, pointer) {
      return $.formatTimeDDHHMM(value + "");
    },
    onbarclicked:function () {
      var value = $(".range-slider").jRange("getValue")
      if(value != NaN){
        heatLayer.setData(heatMapData[value]);
      }
    },
    width: 800,
    showLabels: true,
    snap: true
  });
  $(".play-heat").on("click", function() {
    initHeatAnimation();
  });
  var heatMapData = {
    201804280000: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, count: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, count: 100 }
      ]
    },
    201804280100: {
      max: 10,
      data: [
        { lat: 41.07222222222222, lng: 117.59722222222221, count: 100 },
        { lat: 38.07222222222222, lng: 115.00722222222221, count: 100 }
      ]
    },
    201804280200: {
      max: 10,
      data: [
        { lat: 42.07222222222222, lng: 118.59722222222221, count: 100 },
        { lat: 36.07222222222222, lng: 113.00722222222221, count: 100 }
      ]
    },
    201804280300: {
      max: 10,
      data: [
        { lat: 45.07222222222222, lng: 120.59722222222221, count: 100 },
        { lat: 30.07222222222222, lng: 110.00722222222221, count: 100 }
      ]
    },
    201804280400: {
      max: 10,
      data: [
        { lat: 42.07222222222222, lng: 120.59722222222221, count: 100 },
        { lat: 35.07222222222222, lng: 105.00722222222221, count: 100 }
      ]
    },
    201804280500: {
      max: 10,
      data: [
        { lat: 30.691667, lng: 106.101667, count: 100 },
        { lat: 37.034444, lng: 79.869167, count: 100 }
      ]
    },
    201804280600: {
      max: 10,
      data: [
        { lat: 31.156944, lng: 107.44, count: 100 },
        { lat: 36.638333, lng: 109.605, count: 100 }
      ]
    },
    201804280700: {
      max: 10,
      data: [
        { lat: 28.428611, lng: 115.921944, count: 100 },
        { lat: 27.8616672, lng: 109.293333, count: 100 }
      ]
    },
    201804280800: {
      max: 10,
      data: [
        { lat: 41.266667, lng: 80.228333, count: 100 },
        { lat: 31.589444, lng: 120.319444, count: 100 }
      ]
    },
    201804280900: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, count: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, count: 100 }
      ]
    },
    201804281000: {
      max: 10,
      data: [
        { lat: 43.908889, lng: 87.473056, count: 100 },
        { lat: 21.861667, lng: 100.935556, count: 100 }
      ]
    },
    201804281100: {
      max: 10,
      data: [
        { lat: 36.401667, lng: 94.881667, count: 100 },
        { lat: 30.255, lng: 121.220278, count: 100 }
      ]
    },
    201804281200: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, count: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, count: 100 }
      ]
    },
    201804281300: {
      max: 10,
      data: [
        { lat: 35.758333, lng: 107.645, count: 100 },
        { lat: 24.409722, lng: 98.538056, count: 100 }
      ]
    },
    201804281400: {
      max: 10,
      data: [
        { lat: 38.149444, lng: 85.534444, count: 100 },
        { lat: 28.799444, lng: 104.555556, count: 100 }
      ]
    },
    201804281500: {
      max: 10,
      data: [
        { lat: 30.523056, lng: 97.14, count: 100 },
        { lat: 40.148333, lng: 94.708333, count: 100 }
      ]
    },
    201804281600: {
      max: 10,
      data: [
        { lat: 34.276944, lng: 117.999167, count: 100 },
        { lat: 25.644167, lng: 100.324722, count: 100 }
      ]
    },
    201804281700: {
      max: 10,
      data: [
        { lat: 32.672222, lng: 118.579167, count: 100 },
        { lat: 34.555, lng: 108.63, count: 100 }
      ]
    },
    201804281800: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, count: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, count: 100 }
      ]
    },
    201804281900: {
      max: 10,
      data: [
        { lat: 34.600278, lng: 108.916389, count: 100 },
        { lat: 34.431667, lng: 108.728333, count: 100 }
      ]
    },
    201804282000: {
      max: 10,
      data: [
        { lat: 36.528056, lng: 102.031389, count: 100 },
        { lat: 30.886667, lng: 120.416667, count: 100 }
      ]
    },
    201804282100: {
      max: 10,
      data: [
        { lat: 28.852778, lng: 105.385556, count: 100 },
        { lat: 46.66, lng: 83.37, count: 100 }
      ]
    },
    201804282200: {
      max: 10,
      data: [
        { lat: 29.631667, lng: 105.756667, count: 100 },
        { lat: 29.765, lng: 119.658333, count: 100 }
      ]
    },
    201804282300: {
      max: 10,
      data: [
        { lat: 22.646667, lng: 113.801667, count: 100 },
        { lat: 29.764444, lng: 119.658333, count: 100 }
      ]
    }
  };
  //初始化热力图动画
  var initHeatAnimation = function() {
    var isPlay = eval($(".play-heat").attr("isPlay"));
    var timer;
    if (!isPlay) {
      //播放
      $(".play-heat").removeClass("glyphicon-play");
      $(".play-heat").addClass("glyphicon-pause");
      $(".play-heat").attr("isPlay", true);
      playAnimation(true);
    } else {
      //暂停
      $(".play-heat").removeClass("glyphicon-pause");
      $(".play-heat").addClass("glyphicon-play");
      $(".play-heat").attr("isPlay", false);
      playAnimation(false);
    }
  };
  //动画播放
  var playAnimation = function(isPlay) {
    var currentValue = $(".range-slider").jRange("getValue");
    var setValue = currentValue * 1 + 100 + "";
    var startDate = ($.getFullTime(currentDate).substring(0, 8) + "0000");
    var endDate = ($.getFullTime(currentDate).substring(0, 8) + "2400");
    if (isPlay) {
      if (setValue == endDate) {
        $(".range-slider").jRange("setValue", startDate);
        heatLayer.setData(heatMapData[startDate]);
      } else {
        $(".range-slider").jRange("setValue", setValue);
        heatLayer.setData(heatMapData[setValue]);
      }
      timer = setTimeout(function() {
        playAnimation(isPlay);
      }, 1000);
    } else {
      clearTimeout(timer);
    }
  };
})();
