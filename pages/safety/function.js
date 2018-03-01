//获取应用实例
var app = getApp()
Page({
  data: {
    height:0
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
  },
  maptap: function() {
    wx.redirectTo({
      url: '../safety/map',
    })
  },
  unittap: function(e) {
      var url = e.currentTarget.dataset.url;
      app.goto(url);
  }
})
