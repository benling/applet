//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    list: [],
    intervalList:[1,2,5,10,15,20,30,60,90,120]
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
    //查询电子围栏列表
    this.getList();
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      console.log(this.data.startX);
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = 180;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
          txtStyle = "left:-" + disX + "px";
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度
            txtStyle = "left:-" + delBtnWidth + "px";
          }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = 180;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  //查询电子围栏列表
  getList: function () {
    var that = this;
    app.ajax({
      url: '/studentSecure/electronRailList',
      data: {},
      success: function (res) {
        var list = res.bizData.result;
        if (list && list.length > 0) {
            that.setData({
              list: list
            })
        }
      }
    });
  },
  addtap: function() {
    wx.redirectTo({
      url: '../safety/electronFenceAdd',
    })
  },
  deltap: function(e) {
      var id = e.currentTarget.dataset.id;
      app.confirm('确定删除吗?', function () {
        app.ajax({
          url: '/studentSecure/deleteElectronRail',
          data: { regionid: id },
          success: function (res) {
            wx.redirectTo({
              url: '../safety/electronFence'
            })
          }
        });
      });
  },
  modtap: function (e) {
    var region = e.currentTarget.dataset.region;
    wx.redirectTo({
      url: '../safety/electronFenceAdd?region=' + JSON.stringify(region),
    })
  }
})
