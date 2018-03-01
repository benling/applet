//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    className:""
  },
  onLoad: function () {
    var that = this;
    //查询学校/学生列表
    app.getChoseInfo(function(info) {
        that.setData({
           className:info.className
        })
    });
  },
  //点击应用
  appTap: function(e){
    var url = e.currentTarget.dataset.url;
    var id = e.currentTarget.dataset.id;
    var that = this;
    if(!url) {
      app.alert('努力建设中，敬请期待！');
      return;
    }
    app.goto(url);
  }
})
