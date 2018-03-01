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
  //查询迟到学生集合
  getList: function (classInfo,time) {
    var that = this;
    var param = { classId: classInfo.id, isEarly:1};
    if(time) {
      param.date = time;
    }
    app.ajax({
      url: '/teacherCheck/listIsLateOrIsEarly',
      data: param,
      success: function (res) {
        var list = res.bizData;
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
