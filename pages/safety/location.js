//获取应用实例
var app = getApp()
Page({
  data: {
    markers:[],
    height:0,
    hasMap:false
  },
  onLoad: function (param) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //设置地图标记点
    var markers = [{
        iconPath: "/images/safety/nanhai.png",
        id: 0,
        latitude: param.lat,
        longitude: param.lng,
        width: 30,
        height: 30
    }]
    this.setData({
        markers: markers,
        lat:param.lat,
        lng: param.lng,
        hasMap: true
    });
  }
})
