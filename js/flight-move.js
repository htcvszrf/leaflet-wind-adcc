/**
 * Created by caowei on 2018/5/25.
 */
var flightMove = function () {
    //未起飞航班数据组
    var unFlyFlightArr = [];
    /**
     * 绘制未起飞航班
     * @param {航班数据} data
     */
    var drawUnFlyFlight = function (flightData) {
        var flights = flightData;
        $.each(flights, function (index,flight ) {
            //判断航班状态(默认停止)设置圆形颜色
            var flightColor = 'black';
            //设置圆形半径(默认为10)
            var radius = 10;
                if (flight.vec == 0){
                flightColor = 'black';
                radius = 10

            }else {
                //根据速度设置圆形半径
                radius = flight.vec / 20;
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
            var flightCircle = L.circle([flight.lon, fligth.lat], {
                radius: radius,
                color: flightColor
            });
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flight.flightId;
            //显示航班信息
            var title = 'Flight: ' + flight.flightId + "<br>" + "speed: " + flight.vec;
            var opt = {
                permanent: true,
            };
            //绑定title
            flightCircle.bindTooltip(title, opt);
            //判断航班是否进入跑道
            if($.isValidObject(flight.runwatStatus)){
                //未完成
            }
            unFlyFlightArr.push(flight);
        })
    }
    /**
     * 移除航班图层
     * @param {航班图层数组} flightArr
     */
    var removeFlight = function (flightArr) {
        $.each(flightArr, function (index, item) {
            item.remove();
            flightArr.remove(index);
        })
    }

    //飞行航班数据
    var flyFlightArr = [];
    /**
     * 绘制空中航班数据
     * @param {航班数据} flightData
     */
    var drawFlyFlight = function(flightData){
        var fligths = flightData;
        $.each(fligths,function(index,flight){
            var flightCircle = L.circle([flight.lon, flight.lat], {
                radius: radius,
                color: 'yellow'
            });
            //更新航班id到图层id
            flightCircle['_leaflet_id'] = flight.flightId;
            //显示航班信息
            var title = 'Flight: ' + flight.flightId + "<br>" + "speed: " + flight.vec+ "<br>" + "height: " + flight.height;
            var opt = {
                permanent: true,
            };
            flightCircle.bindTooltip(title, opt);
            flyFlightArr.push(flight);
        })

    }

    var setRunwayStyle = function (runwayId,runways) {
        $.each(runways,function (index,runway) {
                if(runway['_leaflet_id'] == runwayId){

                }
        })
    }
}()