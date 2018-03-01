var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      school:{}
  },
  onLoad: function () {
    var that = this;
    /**
     * 初始化emoji设置
     */
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
    app.ajax({
      url: '/schoolInfo/get',
      data: {},
      success: function (res) {
        var result = res.bizData;
        WxParse.wxParse('content', 'html', result.info, that, 5);
        that.setData({
          school: result
        });
      }
    })
  },
  menutap: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  }
})