//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    edate: app.getDay(new Date(),0),
    time:''
  },
  onLoad: function () {
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    //获取作息时间列表
    this.getList(classInfo, app.getDay(new Date(), 0));
  },
  //查询允许来电集合
  getList: function (classInfo,time) {
    var that = this;
    var param = { classId: classInfo.id, date: app.getDay(new Date(), 0) };
    if(time) {
      param.date = time;
    }
    app.ajax({
      url: '/teacherCheck/listAbsenteeism',
      data: param,
      success: function (res) {
        var data = res.bizData;
        //全天缺勤
        var dayList = data['all'];
        //上午缺勤
        var amList = data['am'];
        //下午缺勤
        var pmList = data['pm'];
        var list = [];
        for (var i in dayList) {
          var obj = dayList[i];
          obj.type = '全天缺勤';
          list.push(obj);
        }
        for (var i in amList) {
          var obj = amList[i];
          obj.type = '上午缺勤';
          list.push(obj);
        }
        for (var i in pmList) {
          var obj = pmList[i];
          obj.type = '下午缺勤';
          list.push(obj);
        }
        that.setData({
          list: list
        });
      }
    });
  },
  startDateChange: function(e) {
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    //获取作息时间列表
    this.getList(classInfo, e.detail.value);
    this.setData({
      time:e.detail.value
    });
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
  sendtap: function(e) {
    var imei = e.currentTarget.dataset.imei;
    var index = e.currentTarget.dataset.index;
    var that = this;
    app.confirm("确定通知家长学生没有到达学校吗?", function() {
      app.ajax({
        url: '/teacherCheck/sendPatriarchMsg',
        data: { imei: imei },
        success: function (res) {
          app.alert("通知发送成功");
          that.closeSider(index);
        }
      });
    },function() {
      that.closeSider(index);
    });
    
  },
  confirmtap: function (e) {
      var id = e.currentTarget.dataset.id;
      app.confirm("确定学生已经到达学校吗?", function () {
        app.ajax({
          url: '/teacherCheck/confirmToSchool',
          data: { id: id, status: 1 },
          success: function (res) {
            wx.redirectTo({
              url: '../teacher/absent',
            })
          }
        });
      })
  },
  closeSider: function(index) {
    var list = this.data.list;
    list[index].txtStyle = "";
    this.setData({
      list: list
    });
  }
})
