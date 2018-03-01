//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{},
      modalFlag:true,
      evaContent:"",
      hiddenLoading:true
  },
  onLoad: function (param) {
    var that = this;
    var id = param.id;
    if(id) {
      app.ajax({
        url: "/message/device/info",
        data: {id:id},
        success: function (res) {
          var data = res.bizData;
          that.setData({
            item: data
          });
        }
      });
    }
  },
  shangbaotap: function(e) {
    this.setData({
      modalFlag: false
    });
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  //取消方法
  cancel: function () {
    this.setData({
      modalFlag: true
    });
  },
  //保存方法
  save: function () {
    var that = this;
    if (!that.data.hiddenLoading) {
      return;
    }
    that.setData({
      hiddenLoading: false
    })
    setTimeout(function() {
      var id = that.data.item.alarmId;
      var evaContent = that.data.evaContent;
      if (!evaContent) {
        app.alert("求助原因不能为空.");
        that.setData({
          hiddenLoading: true
        })
        return;
      }
      app.ajax({
        url: "/studentSecure/sendCaution",
        data: { alarmId: id, reason: evaContent },
        success: function (res) {
          if (res.bizData.Code == 0) {
            app.alert("求助发送成功");
            that.setData({
              modalFlag: true
            });
          } else if (res.bizData.Code == 4) {
            app.alert("已发送过求助,不能重复求助。");
          } else {
            app.alert("求助发送失败,请稍后重试!");
          }
        },
        complete: function() {
          that.setData({
            hiddenLoading: true
          })
        }
      });
    },500)
  }
})
