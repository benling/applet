//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: '/teacherShow/listTeachershow',
      data: {},
      success: function (res) {
        var result = res.bizData;
        that.setData({
          list: result
        });
      }
    })
  },
  infotap: function(e) {
      var id = e.currentTarget.dataset.id;
      app.goto('../schoolShow/teacherInfo?id=' + id);
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  }
})
