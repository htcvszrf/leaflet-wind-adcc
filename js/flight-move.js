/**
 * Created by caowei on 2018/5/25.
 */
var flightMove = function () {
    /**
     * 绘制未起飞航班
     * @param flightData
     * @returns {Array} 未起飞航班图层组
     */
    var drawUnFlyFlight = function (flightData, basicMap) {
        //未起飞航班数据组
        var unFlyFlightArr = [];//用来保存未起飞航班图层
        var distanceArr = [];//用来保存距离跑道末端距离图层
        var flights = flightData.flights;//航班数据
        $.each(flights, function (index, flight) {
            //判断航班状态(默认停止)设置圆形颜色
            var flightColor = '#000000';
            //设置圆形半径(默认为10)
            var radius = 100;
            if (flight.vec * 1 == 0) {
                flightColor = 'black';
                radius = 100
            } else {
                //根据速度设置圆形半径
                radius = flight.vec * 1 / 20;
                //加速
                if (flight.speedStatus == 'accelerate') {
                    flightColor = 'red';
                }
                //减速
                if (flight.speedStatus == 'decelerate') {
                    flightColor = 'blue';
                }
                //匀速
                if (flight.speedStatus == 'constantSpeed') {
                    flightColor = 'orange';
                }
            }
            //初始化航班圆形
            var flightCircle = L.circle([flight.lat, flight.lon], {
                radius: radius,
                color: flightColor
            });
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flight.flightid;
            //显示航班信息
            var title = 'Flight: ' + flight.flightid + "<br>" + "speed: " + flight.vec;
            var opt = {
                permanent: true,
            };
            //绑定title
            flightCircle.bindTooltip(title, opt);
            //遍历跑道
            var runways = flightData.runway;
            $.each(runways,function (index,rwy) {
                if(rwy.occupy){
                    var distanceLine = L.polyline(rwy.runwayLatLon, {color: 'red',weight:10}).addTo(map);
                    distanceArr.push(distanceLine)
                }
            })
            //判断航班是否进入跑道
            var flightsData = flightData.flights;
            $.each(flightsData,function (index,flihgt) {
                for(var i=0;i<flight.length;i++){
                    if(flihgt[i].isRunway){
                        //定义航班到跑道末端距离
                        flightCircle.distance = L.polyline(flihgt[i].runwayLatLon, {color: '#00ffff',weight:20}).addTo(map);
                        //修改图层id
                        flightCircle.distance['_leaflet_id'] = flihgt[i].runwayName + "Distance";
                        const distanceTitle = "Distance: " + flihgt[i].runwayDistance;
                        const distanceOpt = {
                            permanent: true,
                        };
                        //绑定title
                        flightCircle.distance.bindTooltip(distanceTitle, distanceOpt);
                    }
                }
            })
            flightCircle.addTo(basicMap)
            unFlyFlightArr.push(flightCircle);
        })
        return {
            distanceArr: distanceArr,
            unFlyFlightArr: unFlyFlightArr
        }
    }
    /**
     * 移除航班图层
     * @param {航班图层数组} flightArr
     */
    var removeFlight = function (flightArr) {
        $.each(flightArr, function (index, item) {
            //移除飞机
            item.remove();
            if ($.isValidObject(item.distance)) {
                //移除距离跑道末端距离
                item.distance.remove();
            }
        })
    }

    /**
     * 绘制空中航班数据
     * @param flightData 航班数据
     * @returns {Array} 航班图层组
     */
    var drawFlyFlight = function (flightData, basicMap) {
        const flyFlightArr = [];
        var fligths = flightData;
        $.each(fligths, function (index, flight) {
            //初始化飞行航班(tubiao)
            var flightCircle = L.icon({
                iconUrl: "img/airport.png",
                iconSize: [18, 18]
            });
            //初始化飞行航班
            var flightCircle = L.marker([flight.lat, flight.lon], {
                icon: flightCircle,
                rotationAngle: flight.vector,//旋转角度
                rotationOrigin: 'center center'//旋转中心轴
            });
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flight.flightid;
            //显示航班信息
            var title = 'Flight: ' + flight.flightid + "<br>" + "speed: " + flight.vec + "<br>" + "height: " + flight.height + "<br>" + "Time:"+ flight.time;
            var opt = {
                permanent: true,
            };
            flightCircle.bindTooltip(title, opt);
            flightCircle.addTo(basicMap)
            flyFlightArr.push(flightCircle);
        })
        return flyFlightArr;
    }
    /**
     * 设置机场跑道样式
     * @param airports 航班数据
     * @param runways 跑道图层组
     */
    var drawRunway = function (airports, runways) {
        //获机场名称
        var apName = airports.apName;
        //获取机场跑道集合
        var runwayArr = airports.runway
        // 遍历跑道集合
        $.each(runwayArr, function (indexNum, runwayStatus) {
            //遍历跑道图层集合
            $.each(runways, function (index, runway) {
                //匹配跑道
                if (runway['_leaflet_id'] == apName + runwayStatus.runwayName) {
                    //判断跑道是否被占用
                    if (runwayStatus.isOccupy) {
                        //占用红色
                        runway.setStyle({
                            color: '#ff0000'
                        })
                    } else {
                        //未占用绿色
                        runway.setStyle({
                            color: '#00ff00'
                        })
                    }
                }
            })
        })

    }
    return {
        drawUnFlyFlight: drawUnFlyFlight,
        removeFlight: removeFlight,
        drawFlyFlight: drawFlyFlight,
        drawRunway: drawRunway
    }
}();