//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    days: [],
    leaveDate:"",
    duration:0,
    begin:1,
    evaContent:"",
    startDate:app.getDay(new Date(),0),
    endDate: app.getDay(new Date(), 30)
  },
  onLoad: function () {
    var leaveTextEnum = app.globalData.leaveTextEnum;
    var days = [];
    for (var name in leaveTextEnum) {
      days.push(leaveTextEnum[name]);
    }
    this.setData({
      days: days
    });
  },
  leaveDateChange: function(e) {
    this.setData({
      leaveDate:e.detail.value
    })
  },
  daysChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  radioChange: function(e) {
    this.data.begin = e.detail.value;
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  formSubmit: function() {
    var leaveDate = this.data.leaveDate;
    var evaContent = this.data.evaContent;
    var begin = this.data.begin;
    var duration = (parseInt(this.data.duration)+1);
    if (!leaveDate) {
      app.alert("请假日期不能为空");
      return;
    }
    if (!evaContent) {
      app.alert("请假原因不能为空");
      return;
    }
    app.ajax({
      url: '/parentsCheck/addCheckLeave',
      data: { begin: begin, duration: duration, content: evaContent, startTime: leaveDate},
      success: function (res) {
        wx.redirectTo({
          url: '../parents/leaveList',
        })
      }
    });
  }
})
