//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    list: [],
    checked:'',
  },
  onLoad: function () {
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //获取开关状态
    app.ajax({
      url: '/teacherCheck/checkOnOffStatus',
      data: { classId: classInfo.id},
      success: function (res) {
          var checked = false;
          if(res.bizData == 1) {
              checked = true;
          }
          that.setData({
            checked: checked
          });
      }
    });
    //获取作息时间列表
    this.getList(classInfo);
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
  //查询允许来电集合
  getList: function (classInfo) {
    var that = this;
    app.ajax({
      url: '/teacherCheck/listCheckSetting',
      data: { classId: classInfo.id},
      success: function (res) {
        var list = res.bizData;
        that.setData({
          list: list
        });
      }
    });
  },
  //开启关闭事件
  switchChange: function(e) {
    var that = this;
    var classInfo = wx.getStorageSync('classInfo');
    var ST = e.detail.value?'1':'2';
    app.ajax({
      url: '/teacherCheck/updateCheckOnOff',
      data: { classId: classInfo.id, status: ST},
      success: function (res) {
        that.setData({
          checked: e.detail.value
        });
      }
    });
    
  },
  //添加点击事件
  addtap: function() {
    app.goto('../teacher/restAdd');
  },
  //修改点击事件
  updatetap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.goto('../teacher/restEdit?id='+id);
  },
  //删除点击事件
  deltap: function (e) {
    var id = e.currentTarget.dataset.id;
    app.confirm('确定删除吗?',function() {
        app.ajax({
          url: '/teacherCheck/deleteCheckSetting',
          data: {id:id},
          success: function (res) {
            wx.redirectTo({
              url: '../teacher/rest'
            })
          }
        });
    });
    
  }
})
