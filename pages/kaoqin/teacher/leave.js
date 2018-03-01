//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    edate: app.getDay(new Date(),0),
    time:''
  },
  onLoad: function () {
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    //获取作息时间列表
    this.getList(classInfo, app.getDay(new Date(), 0));
  },
  //查询允许来电集合
  getList: function (classInfo,time) {
    var that = this;
    var param = { classId: classInfo.id };
    if(time) {
      param.date = time;
    }
    app.ajax({
      url: '/teacherCheck/listCheckLeave',
      data: param,
      success: function (res) {
        var list = res.bizData;
        for (var i in list) {
          var obj = list[i];
          obj.duration = app.globalData.leaveTextEnum[obj.duration];
        }
        that.setData({
          list: list
        });
      }
    });
  },
  startDateChange: function(e) {
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    //获取作息时间列表
    this.getList(classInfo, e.detail.value);
    this.setData({
      time:e.detail.value
    });
  }
})
