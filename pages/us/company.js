//获取应用实例
var app = getApp()
Page({
  data: {
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    app.goto(url);
  }
})
