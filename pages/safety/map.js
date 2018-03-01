//获取应用实例
var app = getApp()
Page({
  data: {
    markers:[],
    temp:[],
    controls: [{
      id:'refresh',
      position: {
          top:15,
          left:15,
          width:40,
          height:40
      },
      iconPath:'/images/safety/shuaxin.png',
      clickable:true
    }],
    height:0,
    hasMap:false,
    latitude: "39.91923",
    longitude: "116.397428"
  },
  onLoad: function () {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //获取地理位置
    this.getPosition();
  },
  //刷新地理位置
  controltap(e) {
    //获取地理位置
    this.getPosition();
  },
  markertap: function(e) {
    var temp = this.data.temp;
    var markers = this.data.markers;
    if (markers[0].callout.content) {
      markers[0].callout = {};
    }else {
      markers[0].callout = temp[0].callout;
    }
    this.setData({
      markers: markers,
    });
  },
  functiontap: function() {
    wx.redirectTo({
      url: '../safety/function',
    })
  },
  //获取学生位置信息
  getPosition: function() {
    var that = this;
    //获取学生位置
    app.ajax({
      url: '/studentSecure/positionQuery',
      data: {},
      success: function (res) {
        var result = res.bizData.result;
        if (result && result.lat && result.lng) {
          var markers = [{
            iconPath: "/images/safety/nanhai.png",
            id: 0,
            latitude: result.lat,
            longitude: result.lng,
            width: 30,
            height: 30,
            callout: {
              content: result.type + ' ' + result.time + '\n\n' + result.desc,
              borderRadius: 5,
              padding: 5,
              fontSize: 10,
              bgColor: "#ffffff",
              display: 'ALWAYS'
            }
          }]
          that.setData({
            markers: markers,
            temp: markers,
            latitude: result.lat,
            longitude: result.lng,
            hasMap: true
          });
        }else {
          that.setData({
            hasMap: true
          });
          app.alert("无法获取到位置信息，请稍后重试！");
        }
      }
    });
  }
})
