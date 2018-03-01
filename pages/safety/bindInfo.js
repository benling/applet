//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
      data:{}
  },
  onLoad: function (param) {
    this.setData({
      data: JSON.parse(param.data)
    });
  }
})
