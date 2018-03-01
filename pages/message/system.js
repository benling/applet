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
      url: "/message/system/list",
      data: {},
      success: function (res) {
        var data = res.bizData;
        for (var i in data) {
          var obj = data[i];
          if (obj.context.length > 38) {
            obj.partContext = obj.context.substring(0, 38)+"...";
          } else {
            obj.partContext = obj.context;
          }
        }
        that.setData({
          list: data
        });
      }
    });
  },
  detailtap: function(e) {
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.obj;
    var list = this.data.list;
    var that = this;
    app.ajax({
      url: "/message/system/read",
      data: { id: id },
      success: function (res) {
        for (var i in list) {
          if (list[i].id == id) {
            list[i].status = 1;
            break;
          }
        }
        that.setData({
          list: list
        });
        app.goto('../message/systemDetail?item=' + JSON.stringify(item));
      }
    });
  }
})
