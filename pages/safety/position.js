//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    list: [],
    checked:true,
    modalFlag: true,
    intervalList:[1,2,5,10,15,20,30,60,90,120],
    flag:false
  },
  onLoad: function () {
    console.log(getCurrentPages());
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //获取列表数据
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
  //查询定位设置列表
  getList: function () {
    var that = this;
    app.ajax({
      url: '/studentSecure/locationSetList',
      data: {},
      success: function (res) {
          var list = res.bizData.result;
          var data = [];
          for (var i in list) {
            var pt = list[i].pt;
            var ss = pt.split("+");
            var time = ss[0];//时间
            if (time == "0-0") {
              break;
            }
            var interval = ss[2];//上报频率
            var id = ss[3];//id 
            var timeStr = time.split("-");
            var start = timeStr[0];
            var end = timeStr[1];
            data.push({id:id,name: '定位时段' + (parseInt(i) + 1), time: start + '~' + end, interval: interval});
          }
          that.setData({
              list:data
          });
      }
    });
  },
  addtap: function() {
    this.setData({
      modalFlag:false,
      id: "",
      stime: "",
      etime: "",
      interval: 0,
      title: '添加定位时段',
      url:'/studentSecure/addLocationSet'
    });
  },
  cancel: function() {
    this.setData({
      modalFlag: true
    });
  },
  modtap: function(e) {
      var obj = e.currentTarget.dataset.obj;
      var flist = this.data.intervalList;
      var index = 0;
      for(var i in flist) {
        if (obj.interval == flist[i]) {
          index = i;
          break;
        }
      }
      this.setData({
          stime: obj.time.split('~')[0],
          etime: obj.time.split('~')[1],
          interval: index,
          modalFlag: false,
          id:obj.id,
          url:'/studentSecure/updateLocationSet',
          title:'修改定位时段'
      });
  },
  deltap: function (e) {
      var id = e.currentTarget.dataset.id;
      app.confirm('确定删除吗？', function () {
        app.ajax({
          url: '/studentSecure/deleteLocationSet',
          data: { PT: id},
          success: function (res) {
            wx.redirectTo({
              url: '../safety/position',
            })
          }
        });
      });
  },
  save: function() {
      if (this.data.flag) {
        return;
      }
      this.data.flag = true;
      var id = this.data.id;
      var url = this.data.url;
      var stime = this.data.stime;
      var etime = this.data.etime;
      var interval = this.data.intervalList[this.data.interval];
      var that = this;
      if (!interval || !stime || !etime) {
        that.data.flag = false;
        app.alert("请输入完整信息！");
        return;
      }
      //开始时间
      var startTime = stime.substring(0, 2) + stime.substring(3);
      //结束时间	
      var endTime = etime.substring(0, 2) + etime.substring(3);
      //开始时间的小时
      var sh = stime.substring(0, 2);
      //开始时间的分钟
      var sm = stime.substring(3);
      //结束时间的小时
      var eh = etime.substring(0, 2);
      //结束时间的分钟
      var em = etime.substring(3);
      if (parseInt(endTime) - parseInt(startTime) <= 0) {
        that.data.flag = false;
        app.alert("开始时间必须早于结束时间，请重新设置！");
        return;
      }
      if (((eh - sh) * 60 + (em - sm)) < parseInt(interval)) {
        that.data.flag = false;
        app.alert("上报频率不能大于定位时间段！");
        return;
      }
      var PT = startTime + "-" + endTime + "+0+" + interval;
      var param = { PT: PT };
      if(id) {
        param.id = id;
      }
      app.ajax({
        url: url,
        data: param,
        success: function (res) {
          if (res.bizData.code == "12") {
            app.alert("定位时间段之间发生交叉，请修改后重新保存!");
          } else {
            wx.redirectTo({
              url: '../safety/position',
            })
          }
        },
        complete: function () {
          that.data.flag = false;
        }
      });
  },
  bindStartTimeChange: function (e) {
    this.setData({
      stime: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  },
  bindIntervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  }
})
