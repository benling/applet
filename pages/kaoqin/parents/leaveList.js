//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    page: 1
  },
  onLoad: function () {
    this.queryList();
  },
  queryList: function () {
    var that = this;
    var page = this.data.page;
    //获取考勤数据-家长端
    app.ajax({
      url: '/parentsCheck/pageListCheckLeave',
      data: { page: page},
      success: function (res) {
        var list = res.bizData.rows;
        var allList = that.data.list;
        if (list && list.length > 0) {
          for (var i in list) {
            var obj = list[i];
            obj.duration = app.globalData.leaveTextEnum[obj.duration];
            allList.push(obj);
          }
          that.setData({
            list: allList
          });
        } else {
          that.data.flag = true;
        }
      }
    });
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.flag) {
      return;
    }
    this.data.page = parseInt(this.data.page) + 1;
    this.getList();
  },
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  },
  deltap: function(e) {
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var that = this;
      app.confirm("确定删除吗?", function() {
        app.ajax({
          url: '/parentsCheck/deleteCheckLeave',
          data: { id: id },
          success: function (res) {
            var list = that.data.list;
            list.splice(index, 1);
            that.setData({
              list: list
            });
          }
        });
      });
  },
  addtap: function() {
    app.goto('../parents/leaveAdd');
  }
})
