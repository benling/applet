//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    modalFlag:true,
    mobile:""
  },
  onLoad: function () {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    })
  },
  deletetap: function() {
    wx.redirectTo({
      url: '../setting/childList',
    })
  },
  updatetap: function(e) {
    var that = this;
    //查询手机号码
    app.ajax({
      url: '/setting/getMobile',
      data: {},
      success: function (res) {
        that.setData({
          modalFlag: false,
          old: res.bizData,
          mobile: ""
        });
      }
    });
  },
  mobileInput: function(e) {
    this.data.mobile = e.detail.value;
  },
  cancel: function() {
    this.setData({
      modalFlag: true
    });
  },
  save: function() {
    var that = this;
    var mobile = this.data.mobile;
    var old = this.data.old;
    var pattern = /^1[1-9]\d{9}$/gi;
    if (!mobile) {
      app.alert("新手机号不能为空!");
      return;
    }
    if (!pattern.test(mobile)) {
      app.alert("新手机号格式不正确!");
      return;
    }
    if (mobile == old) {
      app.alert("原手机号和新手机号不能相同!");
      return;
    }
    app.ajax({
      url: '/setting/settingMobile',
      data: { mobile: mobile},
      success: function (res) {
        that.setData({
          modalFlag: true
        });
        app.alert("修改手机号码成功!");
      }
    });
  }
})
