//获取应用实例
var app = getApp()
Page({
  data: {
    item:{}
  },
  onLoad: function () {
    var that = this;
    //查询周排名
    app.ajax({
      url: '/account/detail',
      data:{},
      success: function (res) {
        var item = res.bizData;
        that.setData({
          item: item
        });
      }
    })
  }
})
