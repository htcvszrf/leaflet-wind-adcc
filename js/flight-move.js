/**
 * Created by caowei on 2018/5/25.
 */
var flightMove = function () {
    /**
     * 绘制航班
     * @param flights 航班数据
     * @param mainMap 地图主图
     */
    var drawFlight = function (flights, mainMap) {
        //保留航班图层结果集
        const flyFlightArr = [];
        //遍历航班对象
        var flightLen = flights.length;
        for (var i = 0; i < flightLen; i++) {
            //航班数据对象
            var flightObj = flights[i];
            //定义航班图层对象
            var flightCircle;
                //根据高度判断航班状态 高度大于50 起飞 否则处于地面状态
            if (flightObj.height*1 >= 50) {
                // 初始化飞行航班(图标)
                var flightIcon = L.icon({
                    iconUrl: "img/airport.png",
                    iconSize: [18, 18]
                });
                //初始化飞行航班
                flightCircle = L.marker([flightObj.lat*1, flightObj.lon*1], {
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
                    if(flightObj.vec*1 < 50){
                        radius = 100;
                    }else{
                        radius = flightObj.vec * 1 / 5;
                    }
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
            }
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flightObj.flightid;
            //显示航班信息
            var title = 'Flight: ' + flightObj.flightid + "<br>" + "speed: " + flightObj.vec + "<br>" + "height: " + flightObj.height + "<br>" + "Time:" + flightObj.time + "<br>" + "lon:" + flightObj.lon + "<br>" + "lat:" + flightObj.lat + "<br>" + "direction:" + flightObj.direction*1;
            //绑定提示信息
            flightCircle.bindPopup(title)
            //打开提示信息
            flightCircle.openPopup();
            //更新当前选中的航班id
            flightCircle.on("click",function () {
                mainMap.layerSelectId = this._leaflet_id;
                showFightDetail(flightObj)
            })
            //添加鼠标交互事件
            flightCircle.on("mouseover ",function () {
                this.openPopup();
            })
            flightCircle.on("mouseout  ",function () {
                this.closePopup();
            })
            //添加到主图上
            flightCircle.addTo(mainMap)
            flyFlightArr.push(flightCircle);
        }

        return {
            unFlyFlightArr: flyFlightArr,

        }
    }
    /**
     * 绘制距离跑道末端距离
     * @param flights
     * @param runwayLayers
     * @returns {{rwyDistanceArr: Array}}
     */
    var drawRunwayStatus = function (flights,mainMap,runwayLayers) {
        //保留航班图层结果集
        const rwyDistanceArr = [];
        //遍历航班对象
        var flightLen = flights.length;
        for (var i = 0; i < flightLen; i++) {
            //航班对象
            var flightObj = flights[i];
            //判断航班是否占用跑道
            if (flightObj.runway) {
                //占用跑道名称
                var occupiedRwy = flightObj.runway.runwayName;
                // 遍历跑道图层对象
                if($.isValidObject(runwayLayers)&&mainMap.hasLayer(runwayLayers)){
                    //获取跑道图层对象集合
                    var rwyLayer = runwayLayers._layers;
                    //创建跑道末端距离对象
                    var rwyDistance;
                    for (var j in rwyLayer) {
                        //跑道图层对象
                        var rwyLayerObj = rwyLayer[j];

                        //根据id判断跑道是否被占用
                        if (occupiedRwy == rwyLayerObj['_leaflet_id']) {
                            if(rwyLayer[occupiedRwy].multFlight){
                                //多条航班占用黑色
                                rwyLayerObj.setStyle({
                                    color: '#000000',
                                    fillColor:"#000000"
                                })
                            }else{
                                //单条航班占用红色
                                rwyLayerObj.multFlight = true;
                                rwyLayerObj.setStyle({
                                    color: '#ff0000',
                                    fillColor:"#ff0000"
                                })
                            }
                        } else {
                            //没有用绿色
                            rwyLayerObj.setStyle({
                                color: '#008000',
                                fillColor:"#008000"
                            })
                            rwyLayerObj.multFlight = false;
                        }
                        //当距离跑道末端小于1.5km时不显示
                        if(flightObj.speedStatus == 'accelerate'){
                            //绘制航班到跑道末端距离
                            rwyDistance = L.polyline(flightObj.runway.runwayLatLon, {
                                color: '#ff00ff',
                                weight: 5
                            });
                            //修改图层id
                            rwyDistance['_leaflet_id'] = flightObj.runway.runwayName + flightObj.flightid;
                            //定义title
                            const distanceTitle = "Distance: " + flightObj.runway.runwayDistance + "km";
                            const distanceOpt = {
                                permanent: true,
                            };
                            //绑定title
                            rwyDistance.bindTooltip(distanceTitle, distanceOpt);
                            rwyDistance.addTo(mainMap);
                        }
                        }
                    //当距离跑道末端小于1km时不显示
                    if(flightObj.speedStatus == 'accelerate'){
                        //保存到数组中
                        rwyDistanceArr.push(rwyDistance);
                    }
                }
            }
        }
        return{
            rwyDistanceArr:rwyDistanceArr
        }
    }
    /**
     * 移除图层
     * @param flightLayers 航班图层
     * @param mainMap 地图主图
     */
    var removeFlight = function (flightLayers,distanceLayers,mainMap) {
        //移除航班图层
        for(var i=0;i<flightLayers.length;i++){
            mainMap.removeLayer(flightLayers[i]);
        }
        //移除跑道末端距离图层
        for(var i=0;i<distanceLayers.length;i++){
            //移除航班图层
            mainMap.removeLayer(mainMap._layers[distanceLayers[i]._leaflet_id]);
        }
    }
    /**
     * 重置跑道样式配置
     * @param rwyLayer
     */
    var removeRunwayStyle = function (rwyLayer) {
        var rwyLayers = rwyLayer._layers;
        for (var j in rwyLayers) {
                rwyLayers[j].setStyle({
                    color: '#008000',
                    fillColor:"#008000"
                })
                rwyLayers[j].multFlight = false;
        }
    }
    /**
     * 展示航班详情信息
     * @param flight
     */
    var showFightDetail = function (flight) {
        if($(".board").css('right')<0){
            $("#main").animate({
                width:'80%'
            },'slow');
            $(".board").animate({
                right:'0%'
            },'slow')
        }
        $('.flightId').html(flight.flightid);
        $('.depap').html(flight.depap);
        $('.arrap').html(flight.arrap);
        $('.time').html(flight.time);
        $('.vec').html(flight.vec);
        $('.direction').html(flight.direction);
    }
    return {
        drawFlight: drawFlight,
        removeFlight: removeFlight,
        drawRunwayStatus:drawRunwayStatus,
        removeRunwayStyle:removeRunwayStyle
    }
}();