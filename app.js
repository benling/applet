//app.js
App({
  globalData: {
    url:'https://wx.kingteks.com/applet',
    roleEnum: { A: "校长", B: "班主任", C: "任课老师", D: "家长", N: "游客"},
    leaveTextEnum: { 1: "半天", 2: "一天", 3: "一天半", 4: "两天", 5: "两天半", 6: "三天", 7: "三天半", 8: "四天", 9: "四天半", 10: "五天" }
  }, 
  onLaunch: function () {
    //显示分享按钮
    wx.showShareMenu({
      withShareTicket: true
    });
    //清空用户缓存
    //缓存用户信息
    wx.setStorageSync('userInfo', {});
  },
  ajax:function(opt){
    //用户信息处理
    var that = this
    //获取用户信息
    var userInfo = that.getUserInfo();
    console.log("用户信息:");
    console.log(userInfo);
    //如果获取不到用户信息调用微信登陆注册借口
    if (!userInfo || !userInfo.openId) {
      that.wxLogin(function() {
        that.sendRequest(opt);
      });
    }
    //如果获取到用户信息直接发送ajax请求
    else {
      that.sendRequest(opt);
    }
  },
  wxLogin: function(sucFunc) {
    var that = this
    //获取当前用户信息
    var userInfo = that.getUserInfo() || {};
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (user) {
            //赋值用户基本信息(头像，姓名等)
            userInfo.avatarUrl = user.userInfo.avatarUrl;
            userInfo.username = user.userInfo.nickName;
            //设置jsCode
            userInfo.jsCode = res.code;
            wx.request({
              url: that.globalData.url + '/register',
              data: userInfo,
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
              header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header    
              success: function (res) {
                //设置openId
                //userInfo.openId = res.data.openId;
                userInfo.openId = res.data.bizData.openId;
                //缓存用户信息
                wx.setStorageSync('userInfo', userInfo);
                if (sucFunc) {
                  sucFunc();
                }
              }
            });
          },
          fail: function () {
            //没获取到用户信息
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '因您拒绝微校园授权，部分功能暂无法使用，如想体验完整功能请重新关注‘优视微校园’小程序并允许授权以获取更多服务！'
            });
          }
        });
      },
      fail: function () {
        //用户拒绝授权
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '因您拒绝微校园授权，部分功能暂无法使用，如想体验完整功能请重新关注‘优视微校园’小程序并允许授权以获取更多服务！'
        });
      }
    })
  },
  sendRequest: function (opt) {
    var that = this;
    var userInfo = that.getUserInfo();
    var header = opt.header ? opt.header:{ 'content-type': 'application/x-www-form-urlencoded' };
    opt.data.openId = userInfo.openId;
    wx.request({
      url: that.globalData.url + opt.url,
      data: opt.data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
      header: header, // 设置请求的 header    
      success: function (res) {
        console.log(res);
        //异常code处理
        if (res.data.rtnCode == '999999') {
          if (opt.fail) {
            opt.fail(res);
          }else{
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '网络异常，请稍后重试！'
            });
          }
          return;
        } else if (res.data.rtnCode != '000000') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg ? res.data.msg : "请求数据发生异常."
            });
          }
          return;
        } else {
          if (opt.success) {
            opt.success(res.data);
          }
        }
      },
      fail: function (res) {
        if (opt.fail) {
          opt.fail(res);
        }
      },
      complete: function (res) {
        if (opt.complete) {
          opt.complete(res);
        }
      }
    });
  },
  //获取用户信息
  getUserInfo:function(cb){
    return wx.getStorageSync('userInfo');
  },
  //获取选中信息
  getChoseInfo:function(cb){
    this.ajax({
      url: '/app/getChoseInfo',
      data: this.getUserInfo(),
      success: function (res) {
        if (cb){
          cb(res.bizData);
        }
      }
    });
  },
  //设置缓存,s=秒
  put:function(k,v,s){
    var postfix = '_deadtime';
    wx.setStorageSync(k, v)
    var seconds = parseInt(s);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(k + postfix, timestamp + "")
    } else {
      wx.removeStorageSync(k + postfix)
    }
  },
  //获取缓存,def=默认值
  get:function(k,def){
    var postfix = '_deadtime';
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else {
      return def;
    }
  },
  /**
 * 获取指定的日期
 * @param  intervalDay为-1时返回昨天的日期，0返回当前日期，1为明天的日期
 */
  getDay: function (date,intervalDay) {
    if (isNaN(intervalDay))
      intervalDay = 0;

    var localYear = date.getFullYear();
    var localMonth = date.getMonth();
    var localDate = date.getDate();

    var result = new Date(localYear, localMonth, localDate + intervalDay);
    var tempMonth = result.getMonth() + 1;
    var resultMonth = tempMonth >= 10 ? tempMonth : ('0' + tempMonth);
    var tempDate = result.getDate();
    var resultDate = tempDate >= 10 ? tempDate : ('0' + tempDate);

    return result.getFullYear() + "-" + resultMonth + "-" + resultDate;
  },
  alert: function(content) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: content
    });
  },
  confirm: function (content,okFunc,cancelFunc) {
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          okFunc();
        } else if (res.cancel) {
          if (cancelFunc) {
            cancelFunc();
          }
        }
      }
    });
  },
  goto: function (url) {
    if (getCurrentPages().length == 4) {
      wx.redirectTo({
        url: url
      })
    } else {
      wx.navigateTo({
        url: url
      })
    }
  }
})