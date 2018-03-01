//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list:[],
    edate:app.getDay(new Date(),0),
    time: app.getDay(new Date(), 0)
  },
  onLoad: function () {
    this.queryList();
  },
  queryList: function() {
    var that = this;
    var date = this.data.time;
    //获取考勤数据-家长端
    app.ajax({
      url: '/parentsCheck/recordsQuery',
      data: { date: date},
      success: function (res) {
        var list = res.bizData;
        that.setData({
          list: list
        });
      }
    });
  },
  bindTimeChange: function(e) {
    this.queryList();
    this.setData({
      time:e.detail.value
    });
  },
  bottomMenuTap: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  }
})
