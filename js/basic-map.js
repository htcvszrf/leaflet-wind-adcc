var initMap = (function() {
  var mymap = L.map("main", {
    crs : L.CRS.EPSG4326,
    });
  mymap.on('moveend',function () {
    var arr = mymap.getBounds();
    console.log(arr);
  })
  var openmap = L.tileLayer.wms('http://192.168.243.41:7070/geoserver/gwc/service/wms',{layers: 'chinaosm:osm',format:'image/png8'}).addTo(mymap)
  //中国轮廓图
  L.geoJSON(china, {
      style: function (feature) {
          return {
              color: "#c5c5c5",
              fillColor: "#ff000000",
              weight: 0.8
              // fillOpacity:1
          };
      }
  }).addTo(mymap);
  //边境地图
  L.geoJSON(bd4, {
      style: function (feature) {
          return {
              color: "#5c5c5c",
              fillColor: "#ccc",
              weight: 0.8
              // fillOpacity:1
          };
      }
  }).addTo(mymap);
  //边境地图
  L.geoJSON(bd3, {
      style: function (feature) {
          return {
              color: "#5c5c5c",
              fillColor: "#ccc",
              weight: 0.8
              // fillOpacity:1
          };
      }
  }).addTo(mymap);
  /**
   * 控制器
   * @param obj 图层对象
   */
  var controlMapsFunc = function(obj) {
    var zoomIndex = mymap.getZoom();
    var bound = mymap.getBounds();
    console.log(bound);
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
  // var airwayMap =  L.tileLayer.wms('http://192.168.243.67:3619/geoserver/gwc/service/wms',{layers: 'china-osm:airway',format:'image/png8'}).on("add", function() {
  //   controlMapsFunc(waypointMap);
  // });

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
  // var firMap = L.tileLayer.wms('http://192.168.243.67:3619/geoserver/gwc/service/wms',{layers: 'china-osm:fir',format:'image/png8'}).on("add", function() {
    // controlMapsFunc(waypointMap);
  // });

  // 机场图标
  var airportIcon = L.icon({
    iconUrl: "img/airport.png",
    iconSize: [18, 18]
  });

  //机场点
  var airpointMap = L.geoJSON(airpoint, {
    // 添加机场图标
    pointToLayer: function(geoJsonPoint, latlng) {
      if(geoJsonPoint.properties.type!='军用机场'&& geoJsonPoint.properties.type!='军用备降机场'){
        return L.marker(latlng, {
          icon: airportIcon
        });
      }
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
      if(feature.properties.type!='军用机场'&& feature.properties.type!='军用备降机场'){
        var title = feature.properties.name;
        var opt = {
          permanent: true,
          className: "apName"
        };
        layer.bindTooltip(title, opt);
        layer.closeTooltip();
      }
    }
  }).on("add", function() {
    controlMapsFunc(airpointMap);
  });
  laysersMap.push(airpointMap);
  //跑道
  var flStep = 0;
  var timer = '';
  var runwayMap = L.geoJSON(runway, {
    style: function(feature) {
      var obj = {
        color: "green",
        fillColor: "green",
        weight: 1
      };
      return obj;
    },
    onEachFeature: function (feature, layer) {
        var title = feature.properties.name
        var opt = {
            permanent: true
        }
      var opt = {
        permanent: true,
        className: "apName"
      };
      layer._leaflet_id = title;
      layer.bindTooltip(title, opt);
    }
  }).on("add", function() {
    controlMapsFunc(runwayMap);
    //初始化机场动画
    initFlightAnimation()
  });

  //初始化航班动画
  var initFlightAnimation = function () {
    var flights = {};
  //遍历航班动画数据
    $.each(flightAinamtion,function (i,e) {
      //拿到航班数据进行动画渲染
      var flightMove = L.circleMarker([e[0].lat,e[0].lon],{
        radius: 10,
        color:'orange'
      }).addTo(mymap);
      //设置航班名称
      var title = i;
      var opt = {
        permanent: true,
      };
      flightMove.bindTooltip(title, opt);
      //绑定数据
      flightMove['positionData'] = flightAinamtion[i];
      flightMove['flStep'] = 0;
      flights[i] = flightMove;
    })
    var timer = setInterval(function () {
      $.each(flights,function (i,e) {
        //判断加减速状态
        if(e.positionData[e.flStep].vec*1 - e.positionData[e.flStep+1].vec*1>30){
          e.setStyle({
            color:'blue'
          })
        }else if(e.positionData[e.flStep].vec*1 - e.positionData[e.flStep+1].vec*1<-30){
          e.setStyle({
            color:'red'
          })
        }
        //设置定时器
        e.setLatLng([e.positionData[e.flStep].lat, e.positionData[e.flStep].lon])
        //匹配航班是否进入跑道
        var results = leafletPip.pointInLayer([e.positionData[e.flStep].lon,e.positionData[e.flStep].lat], runwayMap);
        if(results.length>0){
          //匹配成功设置跑道为占用状态
          results[0].setStyle({
            color:'red',
            fillColor:'red'
          })
        }
        e.flStep++;
        //航班已起飞结束动画
        if(e.flStep == e.positionData.length-1){
          flights[i].remove();
          delete flights[i];
        }
      })
      if($.isEmptyObject(flights)){
        clearInterval(timer);
      }
    },500)
  }
  laysersMap.push(runwayMap);
  //合并机场点和跑道
  var airports = L.featureGroup([runwayMap, airpointMap]);

  //航路点
  // var waypointMap =  L.tileLayer.wms('http://192.168.243.67:3619/geoserver/gwc/service/wms',{layers: 'china-osm:waypoint',format:'image/png8'}).on("add", function() {
    // controlMapsFunc(waypointMap);
  // });
  //设置地图中心视角
  mymap.setView([30.549072229927816,103.95217360516556], 13);//北京机场

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
    valueField: "value", //热力点的值
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
      { lat: 40.07222222222222, lng: 116.59722222222221, value: 10 },
      { lat: 39.07222222222222, lng: 117.00722222222221, value: 10 }
    ]
  };
  //热力图层
  var heatLayer = new HeatmapOverlay(cfg).on("add", function() {
    $(".video").show();
  }).on("remove", function() {
    $(".video").hide();
  });
  heatLayer.setData(testData);
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
    ondragend:function () {
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
    201805230000: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 ,radius:0.1},
        { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 ,radius:100}
      ]
    },
    201805230100: {
      max: 10,
      data: [
        { lat: 41.07222222222222, lng: 117.59722222222221, value: 100 ,radius:0.2},
        { lat: 38.07222222222222, lng: 115.00722222222221, value: 100 ,radius:0.02}
      ]
    },
    201805230200: {
      max: 10,
      data: [
        { lat: 42.07222222222222, lng: 118.59722222222221, value: 100 },
        { lat: 36.07222222222222, lng: 113.00722222222221, value: 100 }
      ]
    },
    201805230300: {
      max: 10,
      data: [
        { lat: 45.07222222222222, lng: 120.59722222222221, value: 100 },
        { lat: 30.07222222222222, lng: 110.00722222222221, value: 100 }
      ]
    },
    201805230400: {
      max: 10,
      data: [
        { lat: 42.07222222222222, lng: 120.59722222222221, value: 100 },
        { lat: 35.07222222222222, lng: 105.00722222222221, value: 100 }
      ]
    },
    201805230500: {
      max: 10,
      data: [
        { lat: 30.691667, lng: 106.101667, value: 100 },
        { lat: 37.034444, lng: 79.869167, value: 100 }
      ]
    },
    201805230600: {
      max: 10,
      data: [
        { lat: 31.156944, lng: 107.44, value: 100 },
        { lat: 36.638333, lng: 109.605, value: 100 }
      ]
    },
    201805230700: {
      max: 10,
      data: [
        { lat: 28.428611, lng: 115.921944, value: 100 },
        { lat: 27.8616672, lng: 109.293333, value: 100 }
      ]
    },
    201805230800: {
      max: 10,
      data: [
        { lat: 41.266667, lng: 80.228333, value: 100 },
        { lat: 31.589444, lng: 120.319444, value: 100 }
      ]
    },
    201805230900: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
      ]
    },
    201805231000: {
      max: 10,
      data: [
        { lat: 43.908889, lng: 87.473056, value: 100 },
        { lat: 21.861667, lng: 100.935556, value: 100 }
      ]
    },
    201805231100: {
      max: 10,
      data: [
        { lat: 36.401667, lng: 94.881667, value: 100 },
        { lat: 30.255, lng: 121.220278, value: 100 }
      ]
    },
    201805231200: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
      ]
    },
    201805231300: {
      max: 10,
      data: [
        { lat: 35.758333, lng: 107.645, value: 100 },
        { lat: 24.409722, lng: 98.538056, value: 100 }
      ]
    },
    201805231400: {
      max: 10,
      data: [
        { lat: 38.149444, lng: 85.534444, value: 100 },
        { lat: 28.799444, lng: 104.555556, value: 100 }
      ]
    },
    201805231500: {
      max: 10,
      data: [
        { lat: 30.523056, lng: 97.14, value: 100 },
        { lat: 40.148333, lng: 94.708333, value: 100 }
      ]
    },
    201805231600: {
      max: 10,
      data: [
        { lat: 34.276944, lng: 117.999167, value: 100 },
        { lat: 25.644167, lng: 100.324722, value: 100 }
      ]
    },
    201805231700: {
      max: 10,
      data: [
        { lat: 32.672222, lng: 118.579167, value: 100 },
        { lat: 34.555, lng: 108.63, value: 100 }
      ]
    },
    201805231800: {
      max: 10,
      data: [
        { lat: 40.07222222222222, lng: 116.59722222222221, value: 100 },
        { lat: 39.07222222222222, lng: 117.00722222222221, value: 100 }
      ]
    },
    201805231900: {
      max: 10,
      data: [
        { lat: 34.600278, lng: 108.916389, value: 100 },
        { lat: 34.431667, lng: 108.728333, value: 100 }
      ]
    },
    201805232000: {
      max: 10,
      data: [
        { lat: 36.528056, lng: 102.031389, value: 100 },
        { lat: 30.886667, lng: 120.416667, value: 100 }
      ]
    },
    201805232100: {
      max: 10,
      data: [
        { lat: 28.852778, lng: 105.385556, value: 100 },
        { lat: 46.66, lng: 83.37, value: 100 }
      ]
    },
    201805232200: {
      max: 10,
      data: [
        { lat: 29.631667, lng: 105.756667, value: 100 },
        { lat: 29.765, lng: 119.658333, value: 100 }
      ]
    },
    201805232300: {
      max: 10,
      data: [
        { lat: 22.646667, lng: 113.801667, value: 100 },
        { lat: 29.764444, lng: 119.658333, value: 100 }
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
  //热力图动画播放
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


  //定义图层
  var baseMapLaysers = {
    中国: openmap
  };
  //添加图层控制
  var layerControl = L.control.layers(baseMapLaysers);
  layerControl.addTo(mymap);
  layerControl.addOverlay(secMap, "扇区");
  layerControl.addOverlay(airports, "机场");
  layerControl.addOverlay(velocityLayer, "风向图");
  layerControl.addOverlay(accMap, "管制区");
  layerControl.addOverlay(appsectorMap, "进近扇区");
  layerControl.addOverlay(appterMap, "进近终端区");
  layerControl.addOverlay(heatLayer, "热力图");
  // layerControl.addOverlay(airwayMap, '航路');
  // layerControl.addOverlay(firMap, '情报区');
  // layerControl.addOverlay(waypointMap, "航路点");

})();
