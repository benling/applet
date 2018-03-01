//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list:[],
    hiddenLoading:false
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url:"/camera/cameraList",
      data:{},
      success: function(res) {
        if (res.bizData != null && res.bizData.length > 0){
          that.setData({
            list: res.bizData
          });
        }
      },
      complete: function(){
        that.setData({
          hiddenLoading: true
        });
      }
    });
  },
  playtap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.goto("../live/play?id="+id);
  }
})
