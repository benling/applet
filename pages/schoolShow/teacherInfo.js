var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    teacher: {}
  },
  onLoad: function (param) {
    var that = this;
    /**
     * 初始化emoji设置
     */
    WxParse.emojisInit('[]', "/wxParse/emojis/");
    var id = param.id;
    var that = this;
    //点赞
    app.ajax({
      url: '/teacherShow/get',
      data: { id: id },
      success: function (res) {
        var object = res.bizData;
        WxParse.wxParse('content', 'html', object.content, that, 5);
        that.setData({
          teacher: object
        });
      }
    });

  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  }
})
