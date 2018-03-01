//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
  onLoad: function () {
      this.getScheduleList();
  },
  getScheduleList: function () {
    var that = this;
    //获取课程表数据
    app.ajax({
      url: '/schedule/listSchedule',
      data: {},
      success: function (res) {
        var scheduleList = res.bizData;
        var mors = [];
        var afts = [];
        var cols = [];
        for (var i in scheduleList) {
          cols.push(scheduleList[i]);
          if (i % 7 == 6) {
            if (scheduleList[i].amPm == 1) {
              mors.push(cols);
            } else {
              afts.push(cols);
            }
            cols = [];
          }
        }
        that.setData({
          mors: mors,
          afts: afts,
          shwoPage: true
        });
      }
    });
  },
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  }
})
