//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{
      }
  },
  onLoad: function (param) {
    var that = this;
    var id = param.id;
    if(id) {
      app.ajax({
        url: "/message/teach/info",
        data: {id:id},
        success: function (res) {
          var data = res.bizData;
          that.setData({
            item: data
          });
        }
      });
    }
  },
  agreeTap: function(e) {
    var that = this;
    var id = that.data.item.id;
    app.ajax({
      url: "/message/teach/update",
      data: { id: id, applyStatus: '2' },
      success: function (res) {
        wx.redirectTo({
          url: '../message/teach',
        });
      }
    });
  },
  disgreeTap: function (e) {
    var that = this;
    var id = that.data.item.id;
    app.ajax({
      url: "/message/teach/update",
      data: { id: id, applyStatus: '3' },
      success: function (res) {
        wx.redirectTo({
          url: '../message/teach',
        });
      }
    });
  }
})
