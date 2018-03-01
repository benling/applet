//获取应用实例
var app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (param) {
    var that = this;
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    app.ajax({
      url: '/teacherCheck/recordsQuery',
      data: { imei: param.imei, classId: classInfo.id, startDate: param.stime, endtDate:param.etime},
      success: function (res) {
        var list = res.bizData;
        that.setData({
          list: list,
          name:param.name
        });
      }
    });
  }
})
