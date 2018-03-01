//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    edate: app.getDay(new Date(),0),
    time:'',
    flag: false,
    page:1
  },
  onLoad: function () {
    //获取请假条列表
    this.getList();
  },
  //获取请假条列表
  getList: function () {
    var that = this;
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    var page = this.data.page;
    var param = { classId: classInfo.id, page: page};
    app.ajax({
      url: '/teacherCheck/pageListCheckLeave',
      data: param,
      success: function (res) {
        var list = res.bizData.rows;
        var allList = that.data.list;
        if(list && list.length > 0) {
          for (var i in list) {
            var obj = list[i];
            obj.duration = app.globalData.leaveTextEnum[obj.duration];
            allList.push(obj);
          }
          that.setData({
            list: allList
          });
        }else {
          that.data.flag = true;
        }
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
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.flag) {
      return;
    }
    this.data.page = parseInt(this.data.page)+1;
    this.getList();
  },
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  },
  refusetap: function(e) {
    var id = e.currentTarget.dataset.id;
    this.updateStatus(id, 3);
  },
  agreetap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.updateStatus(id,2);
  },
  updateStatus: function(id,status) {
    app.ajax({
      url: '/teacherCheck/updateCheckLeave',
      data: { id: id, status: status},
      success: function (res) {
          wx.redirectTo({
            url: '../teacher/leaveList',
          })
      }
    });
  }
})
