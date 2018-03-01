//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    flag:false,
    id:''
  },
  onLoad: function (param) {
    var id = param.id;
    var that = this;
    app.ajax({
      url:"/camera/getLiveAddress",
      data: { cameraSerial:id},
      success: function(res) {
        var data = res.bizData;
        var item = data.result[0];
        if (data.status == '1') {
          that.setData({
            item: item,
            id:id
          });
        }else {
          app.alert(data.msg);
        }
      }
    });
    //判断视频是否已经播放
    setTimeout(function() {
      if (!that.data.flag) {
        that.setData({
          item: that.data.item,
        });
      }
    },5000)
  },
  timeupdate: function() {
    this.data.flag = true;
  }
})
