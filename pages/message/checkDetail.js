//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{}
      
  },
  onLoad: function (param) {
    var that = this;
    var id = param.id;
    if(id) {
      app.ajax({
        url: "/message/check/info",
        data: {id:id},
        success: function (res) {
          var data = res.bizData;
          that.setData({
            item: data
          });
        }
      });
    }
  }
})
