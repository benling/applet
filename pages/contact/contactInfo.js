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
  },
  calltap: function(e) {
      var num = e.currentTarget.dataset.num;
      wx.makePhoneCall({
        phoneNumber: num //仅为示例，并非真实的电话号码
      })
  }
})
