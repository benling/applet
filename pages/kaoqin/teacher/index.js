//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    classList:[],
    showModalStatus:false
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
    });
    //获取班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        //获取选中班级
        var classInfo = wx.getStorageSync('classInfo');
        var classList = res.bizData;
        //如果没有缓存默认选中第一个班级
        if (!classInfo) {
          classList[0].selected = true;
          wx.setStorageSync('classInfo', classList[0]);
        }else {
          var flag = false;
          //如果有缓存 判断是否在老师权限范围内
          for (var i in classList) {
            if (classInfo.id == classList[i].id) {
              classList[i].selected = true;
              flag = true;
              break;
            }
          }
          //不在权限范围内选中第一个班级
          if(!flag) {
            classList[0].selected = true;
            wx.setStorageSync('classInfo', classList[0]);
          }
        }
        that.setData({
          classList: classList
        });
      }
    });
  },
  //点击应用
  appTap: function(e){
    var url = e.currentTarget.dataset.url;
    var id = e.currentTarget.dataset.id;
    app.goto(url);
  },
  bottomMenuTap: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  },
  switchtap: function(e) {
    var op = e.currentTarget.dataset.status;
    if(op == 'open') {
      this.setData({
        showModalStatus:true
      });
    } else if (op == 'close') {
      this.setData({
        showModalStatus: false
      });
    }
  },
  classtap: function(e) {
    var item = e.currentTarget.dataset.item;
    var classList = this.data.classList;
    for(var i in classList) {
      classList[i].selected = false;
      if (item.id == classList[i].id) {
        classList[i].selected = true;
      }
    }
    wx.setStorageSync('classInfo',item);
    this.setData({
      classList: classList,
      showModalStatus: false
    });
  }
})
