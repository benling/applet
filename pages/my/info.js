//获取应用实例
var app = getApp()
Page({
  data: {
    result:{}
  },
  onLoad: function() {
    var that = this;
    app.ajax({
      url: '/schoolInfo/get',
      data: {},
      success: function (res) {
        var result = res.bizData;
        that.setData({
          school: result
        });
      }
    })
  }
})
