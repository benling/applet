//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
    mobile:'',
    code:'',
    loading: false,
    disabled:false,
    validabled:false,
    seconds:59,
    validcode:""
  },
  mobileEventHandle:function(e){
    this.data.mobile = e.detail.value;
  },
  codeEventHandle:function(e){
    this.data.code = e.detail.value;
  },
  //底部菜单事件处理函数
  bottomMenuTap: function (e) {
    var type = e.currentTarget.dataset.type;
    if(type == 1) {
      wx.redirectTo({
        url: '../index/index'
      })
    }else {
      wx.redirectTo({
        url: '../application/application'
      })
    }
  },
  validcodeEventHandle: function(e) {
      this.setData({
        validcode:e.detail.value
      });
  },
  getValidate: function() {
      var that = this;
      var mobile = that.data.mobile;
      if (!mobile) {
        app.alert('请输入手机号！');
        return;
      }
      if (mobile.length < 11) {
        app.alert('手机号输入错误！');
        return;
      }
      that.setData({
        validabled:true
      })
      //定时器
      var inter = setInterval(function () {
        var seconds = that.data.seconds;
        if (seconds == 1) {
          that.setData({
            validabled: false,
            seconds:59
          })
          clearInterval(inter);
          return false;
        }
        that.setData({
          seconds: (parseInt(seconds) - 1)
        })
      }, 1000);
      //调用发送验证码接口
      app.ajax({
        url: '/getVerificationCode',
        data: { phone: mobile},
        success: function (res) {
         
        }
      });
     
  },
  login: function() {
      var that = this;
      var mobile = that.data.mobile;
      var code = that.data.code;
      var validcode = that.data.validcode;
      if(!mobile){
        app.alert('请输入手机号！');
        return;
      }
      if (mobile.length < 11) {
        app.alert('手机号输入错误！');
        return;
      }
      if (!code) {
        app.alert('请输入邀请码！');
        return;
      }
      if (!validcode) {
        app.alert('请输入短信验证码！');
        return;
      }
      //按钮转圈效果
      that.setData({
        loading: true,
        disabled: true
      });
      //调用login接口
      app.ajax({
        url: '/login',
        data: { mobile: mobile, code: code, captcha: validcode},
        success: function (res) {
            //没有找到教师，游客身份，跳转到添加学生页面
            if(res.bizData.roleId == 'N'){
              wx.redirectTo({
                url: '../my/addSchool?mobile='+mobile+'&code='+code
              })
            }
            //教师，校长、班主任、任课老师
            else{
              app.goto('../index/index');
            }
        },
        complete: function() {
          //取消按钮转圈
          that.setData({
            loading: false,
            disabled: false
          });
        }
      });
  }
})
