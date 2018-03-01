//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{}
  },
  onLoad: function (param) {
    var item = JSON.parse(param.item);
    this.setData({
      item: item
    });
  }
})
