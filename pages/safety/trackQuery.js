//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    disabled:false,
    pdisabled: false,
    sdate: '开始日期',
    edate: '结束日期',
    stime: '开始时间',
    etime: '结束时间',
    sdstart: '2017-01-01',
    sdend: app.getDay(new Date(), 0),
    edstart: '2017-01-01',
    edend: app.getDay(new Date(), 0),
    hasMap:false,
    lat:'22.5509492',
    lng:'113.909458'
  },
  onLoad: function () {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.mapCtx = wx.createMapContext('map')
        that.setData({
          height: res.windowHeight,
          hasMap:true
        });
      }
    })

  },
  startDateChange: function(e) {
    var end = this.data.edate;
    var start = e.detail.value;
    var data = {
      sdate: e.detail.value
    };
    if (end) {
      end = new Date(end);
      start = new Date(start);
      var last = new Date(app.getDay(start,6));
      if (start > end || last  > end) {
        data.edate = '结束日期';
      } 
      data.edstart = e.detail.value;
      if (last > new Date()) {
        data.edend = app.getDay(new Date(), 0);
      } else {
        data.edend = app.getDay(start, 6);
      }
    }
    this.setData(data);
  },
  endDateChange: function(e) {
    var start = this.data.sdate;
    var end = e.detail.value;
    var data = {
      edate: e.detail.value
    };
    if (!start) {
      end = new Date(end);
      data.sdstart = app.getDay(end, -6);
    }
    this.setData(data);
  },
  startTimeChange: function (e) {
    this.setData({
      stime: e.detail.value
    })
  },
  endTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  },
  query: function() {
    var sdate = this.data.sdate;
    var edate = this.data.edate;
    var stime = this.data.stime;
    var etime = this.data.etime;
    var that = this;
    if (!sdate || sdate == "开始日期") {
        app.alert('请选择开始日期');
        return;
    } else if (!stime || stime == "开始时间") {
        app.alert('请选择开始时间');
        return;
    } else if (!edate || edate == "结束日期") {
        app.alert('请选择结束日期');
        return;
    } else if (!etime || etime == "结束时间") {
        app.alert('请选择结束时间');
        return;
    } else if (sdate == edate && etime.replace(":", "") - stime.replace(":", "") <= 0) {
        app.alert("时间选取错误!");
        return;
    } 
    //设置查询按钮不可用
    this.setData({
      disabled: true,
    });
    var ST = sdate+" "+stime;
    var ET = edate+" "+etime;
    //查询轨迹
    app.ajax({
      url: '/studentSecure/trackQuery',
      data: { ST: ST, ET: ET },
      success: function (res) {
          var data = res.bizData.result;
          if(data && data.length > 0) {
              //点集合
              var points = [];
              if (data && data.length > 0) {
                for (var i in data) {
                  var item = data[i];
                  var latlng = { longitude: item.lng, latitude: item.lat };
                  points.push(latlng);
                }
                that.setData({
                  lat:data[0].lat,
                  lng:data[0].lng
                });
              }
              //设置数据刷新到页面
              that.setData({
                polyline: [{
                  points: points,
                  color: '#2595FC',
                  width: 4
                }],
                markers: [
                  {
                    iconPath: "/images/common/start.png",
                    id: 1,
                    latitude: data[0].lat,
                    longitude: data[0].lng,
                    width: 30,
                    height: 30
                  },
                  {
                    iconPath: "/images/common/end.png",
                    id: 2,
                    latitude: data[data.length - 1].lat,
                    longitude: data[data.length - 1].lng,
                    width: 30,
                    height: 30
                  },
                  {
                  iconPath: "/images/common/nanhai.png",
                  id: 0,
                  latitude: data[0].lat,
                  longitude: data[0].lng,
                  width: 20,
                  height: 20
                }],
                points: points
              })
              //缩放地图
              that.mapCtx.includePoints({
                padding: [10],
                points: points
              })
          }else {
              app.alert("未找到任何轨迹数据，您可以尝试修改时间区间!");
              return;
          }
      },
      complete: function () {
          //设置查询按钮可用
          that.setData({
            disabled: false,
          });
      }
    });
  },
  play: function() {
    //设置播放按钮不可用
    this.setData({
      pdisabled: true,
    });
    var points = this.data.points;
    if (!points || (points && points.length == 0)) {
        app.alert("没有可播放轨迹，请先尝试查询轨迹!");
        return;
    }
    var that = this;
    var i = 0;
    var interval = setInterval(function () {
        if(i >= points.length) {
          that.setData({
            pdisabled: false,
          });
          clearInterval(interval);
          return;
        }
        var point = points[i];
        that.mapCtx.translateMarker({
          markerId: 0,
          duration: 1000,
          destination: {
            latitude: point.latitude,
            longitude: point.longitude
          },
          animationEnd() {
            console.log('animation end')
          }
        })
        i++;
    }, 1000)
  }
})
