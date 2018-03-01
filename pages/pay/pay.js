//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hiddenLoading:true,
    disabled:true,
    radioValue:2,
    fee:0
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: "/package/getFee",
      data: {},
      success: function (res) {
        var data = res.bizData;
        that.setData({
          fee:data
        });
      }
    });
  },
  protocoltap: function() {
    wx.navigateTo({
      url: '../pay/protocol'
    })
  },
  checkboxChange: function(e) {
    var value = e.detail.value;
    if(this.data.fee <= 0) {
      return;
    }
    if (value.length > 0) {
      this.setData({
        disabled: false
      })
    }else {
      this.setData({
        disabled: true
      })
    }
  },
  savetap: function() {
    var that = this;
    that.setData({
      hiddenLoading: false,
      disabled: true
    })
    app.ajax({
      url:"/package/payOrder",
      data: { fee: that.data.fee},
      success: function(res) {
        var data = res.bizData;
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.packageInfo,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function() {
            wx.redirectTo({
              url: '../index/main'
            })
          },
          'fail': function (res) {
            var errMessage;
            if (!res){
              errMessage = res;
            }else{
              errMessage = "用户放弃支付";
            }
            app.ajax({
              url: "/package/updatePayLogStatus",
              data: { id: data.busPayTransId, errMessage: errMessage, payOrderId:data.payOrderId},
              success: function (res) {
                  
              }
            })
          }
        });
      },
      complete: function() {
        that.setData({
          hiddenLoading: true,
          disabled: false
        })
      }
    })
  }
})
