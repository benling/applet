//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    modalFlag:true,
    hiddenLoading:true,
    imei:"",
    usertype:"",
    studentId:""
  },
  onLoad: function (param) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          usertype:param.type,
          studentId:param.studentId
        });
      }
    })
  },
  scantap: function() {
    var that = this;
    //调用微信扫一扫
    wx.scanCode({
      onlyFromCamera:true,
      success: function (res) {
        var imei = res.result;
        var pattern = /^([0-9a-fA-F]{14,15})$/gi;
        if (!pattern.test(imei)) {
          app.alert('扫描的学生安全设备号码错误，请重新扫描!');
          return;
        }
        that.setData({
          hiddenLoading: false
        });
        //区分是老师绑定设备还是家长绑定设备
        var param = { imei: imei };
        var url = '/studentSecure/bind';
        if (that.data.usertype == "teacher") {
          param.studentId = that.data.studentId;
          url = '/teacherSecure/bind';
        } 
        //绑定设备
        app.ajax({
          url: url,
          data: param,
          success: function (res) {
            if (that.data.usertype == "teacher") {
              wx.redirectTo({
                url: '../safety/teacher',
              })
            }else {
              app.ajax({
                url: "/package/getPackageStatus",
                data: {},
                success: function (res) {
                  //套餐未到期
                  if (res.bizData == 1) {
                    wx.redirectTo({
                      url: '../safety/map',
                    })
                  }
                  //套餐已到期
                  else {
                    wx.redirectTo({
                      url: '../index/main',
                    })
                  }
                }
              });
              
            }
          },
          complete: function () {
            that.setData({
              hiddenLoading: true
            });
          }
        });
      },
      fail: function() {
        //app.alert('扫描时发生错误，请重新扫描!');
      }
    })
  },
  inputtap: function() {
      this.setData({
          modalFlag:false
      });
  },
  imeiInput: function(e) {
      this.data.imei = e.detail.value;
  },
  cancel: function() {
      this.setData({
        modalFlag: true
      });
  },
  save: function() {
      var that = this; 
      var pattern = /^([0-9a-fA-F]{14,15})$/gi;
      var imei = this.data.imei;
      if (imei == "") {
        app.alert("学生安全设备号码不能为空");
        return;
      }
      if (!pattern.test(imei)) {
        app.alert("输入的学生安全设备号码错误，请重新填写!");
        return;
      }
      this.setData({
        hiddenLoading: false
      });
      //区分是老师绑定设备还是家长绑定设备
      var param = { imei: imei };
      var url = '/studentSecure/bind';
      if (that.data.usertype == "teacher") {
        param.studentId = that.data.studentId;
        url = '/teacherSecure/bind';
      } 
      //绑定设备
      app.ajax({
        url: url,
        data: param,
        success: function (res) {
          if (that.data.usertype == "teacher") {
            wx.redirectTo({
              url: '../safety/teacher',
            })
          } else {
            app.ajax({
              url: "/package/getPackageStatus",
              data: {},
              success: function (res) {
                //套餐未到期
                if (res.bizData == 1) {
                  wx.redirectTo({
                    url: '../safety/map',
                  })
                }
                //套餐已到期
                else {
                  wx.redirectTo({
                    url: '../my/index',
                  })
                }
              }
            });
          }
        },
        complete: function() {
          that.setData({
            hiddenLoading: true
          });
        }
      });
  }
})
