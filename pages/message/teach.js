//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      list:[]
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: "/message/teach/list",
      data: {},
      success: function (res) {
        var data = res.bizData;
        that.setData({
          list: data
        });
      }
    });
  },
  detailtap: function(e) {
    var id = e.currentTarget.dataset.id;
    var list = this.data.list;
    for (var i in list) {
      if(list[i].id == id) {
        list[i].status = 1;
        break;
      }
    }
    this.setData({
      list:list
    });
    app.goto('../message/teachDetail?id=' + id);
  }
})
