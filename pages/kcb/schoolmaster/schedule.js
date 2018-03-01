//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    cindex:0,
    classList:[]
  },
  onLoad: function () {
    var that = this;
    //获取班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        var classList = res.bizData;
        that.setData({
          classList: classList,
          className: classList[0].name
        });
        that.getScheduleList();
      }
    });
  },
  getScheduleList: function () {
    var that = this;
    var classList = that.data.classList;
    var cindex = that.data.cindex;
    //获取课程表数据
    app.ajax({
      url: '/schedule/listSchedule',
      data: { classId: classList[cindex].id },
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
            }else {
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
  classChange: function(e) {
    this.setData({
      cindex:e.detail.value
    });
    this.getScheduleList();
  }
})
