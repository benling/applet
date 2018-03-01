//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    batteryNum:0
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
    })
    //查询电量
    app.ajax({
      url: '/studentSecure/powerQuery',
      data: {},
      success: function (res) {
          that.setData({
              batteryNum: res.bizData.result
          });
      }
    });
  }
})
