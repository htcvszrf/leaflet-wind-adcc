/**
 * Created by caowei on 2018/5/25.
 */
var flightMove = function () {
    /**
     * 绘制航班
     * @param flights
     * @param mainMap
     */
    var drawFlight = function (flights, mainMap, rwyLayer) {
        //保留航班图层结果集
        const flyFlightArr = [];
        //遍历航班对象
        var flightLen = flights.length;
        for (var i = 0; i < flightLen; i++) {
            //航班对象
            var flightObj = flights[i];
            //定义图层对象
            var flightCircle;
            if(flightObj.flightid.split(0,3))
            if (flightObj.height*1 >= 50) {
                // 初始化飞行航班(图标)
                var flightIcon = L.icon({
                    iconUrl: "img/airport.png",
                    iconSize: [18, 18]
                });
                //初始化飞行航班
                flightCircle = L.marker([flightObj.lat, flightObj.lon], {
                    icon: flightIcon,
                    rotationAngle: flightObj.direction*1,//旋转角度
                    rotationOrigin: 'center center'//旋转中心轴
                });
            }
            else if (flightObj.height*1 <= 50) {
                // 判断航班状态(默认停止)设置圆形颜色
                var flightColor = '#000000';
                //设置圆形半径(默认为10)
                var radius = 100;
                if (flightObj.vec * 1 == 0) {
                    flightColor = '#000';
                    radius = 100
                } else {
                    //根据速度设置圆形半径
                    radius = flightObj.vec * 1 / 20;
                    //加速
                    if (flightObj.speedStatus == 'accelerate') {
                        flightColor = '#FF0000';
                    }
                    //减速
                    if (flightObj.speedStatus == 'decelerate') {
                        flightColor = '#0000FF';
                    }
                    //匀速
                    if (flightObj.speedStatus == 'constant') {
                        flightColor = '#FFA500';
                    }
                }
                //初始化航班圆形
                flightCircle = L.circle([flightObj.lat, flightObj.lon], {
                    radius: radius,
                    color: flightColor
                });
                //判断航班是否占用跑道
                if (flightObj.isInRunway) {
                    //占用跑道名称
                    var occupiedRwy = flightObj.isInRunway.runwayName;
                    // 遍历跑道图层对象
                    var rwyLength = rwyLayer.length
                    for (var j = 0; j < rwyLength; j++) {
                        //跑道图层对象
                        var rwyLayerObj = rwyLayer[j];
                        //跑道占用修改跑道颜色
                        if (occupiedRwy == rwyLayerObj['_leaflet_id']) {
                            //占用红色
                            rwyLayerObj.setStyle({
                                color: '#ff0000'
                            })
                        } else {
                            //占用绿色
                            rwyLayerObj.setStyle({
                                color: '#00ff00'
                            })
                        }
                        //绘制航班到跑道末端距离
                        flightCircle.distanceLayer = L.polyline(flightObj.isInRunway.runwayLatLon, {
                            color: '#00ffff',
                            weight: 20
                        }).addTo(map);
                        //修改图层id
                        flightCircle.distanceLayer.distance['_leaflet_id'] = flightObj.isInRunway.runwayName + "Distance";
                        //定义title
                        const distanceTitle = "Distance: " + flightObj.isInRunway.runwayDistance;
                        const distanceOpt = {
                            permanent: true,
                        };
                        //绑定title
                        flightCircle.distanceLayer.bindTooltip(distanceTitle, distanceOpt);
                    }
                }
            }
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flightObj.flightid;
            //显示航班信息
            var title = 'Flight: ' + flightObj.flightid + "<br>" + "speed: " + flightObj.vec + "<br>" + "height: " + flightObj.height + "<br>" + "Time:" + flightObj.time + "<br>" + "direction:" + flightObj.direction;

            flightCircle.bindPopup(title)
            flightCircle.openPopup();
            // var opt = {
            //     permanent: true,
            // };
            // flightCircle.bindTooltip(title, opt);
            // flightCircle.closeTooltip()
            // flightCircle.on("mouseover",function () {
            //     flightCircle.openTooltip()
            // })
            flightCircle.addTo(mainMap)
            flyFlightArr.push(flightCircle);
        }

        return {
            unFlyFlightArr: flyFlightArr
        }
    }
    /**
     * 移除图层
     * @param flightLayers
     * @param distanceLayers
     */
    var removeFlight = function (flightLayers) {
        for(var i=0;i<flightLayers.length;i++){
            //移除航班图层
            flightLayers[i].remove()
            //移除跑道末端距离图层
            if($.isValidObject(flightLayers.distanceLayer)){
                flightLayers.distanceLayer.remove();
            }
        }
    }
    return {
        drawFlight: drawFlight,
        removeFlight: removeFlight,
    }
}();