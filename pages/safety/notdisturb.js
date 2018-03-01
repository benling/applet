//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    list: [],
    checked:true,
    modalFlag: true,
    weekModalFlag:true,
    isShow:'hide',
    showTitle:'show',
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
    //获取状态(学校是否有生效的免扰时段)
    app.ajax({
      url: '/studentSecure/getState',
      data:{},
      success: function (res) {
        if (res.bizData == 2) {
          //获取开关状态
          app.ajax({
            url: '/studentSecure/telephoneAndDisturbSwitch',
            data: { TY: 5 },
            success: function (res) {
              var checked = false;
              if (res.bizData.result.st == '1') {
                checked = true;
              }
              that.setData({
                checked: checked,
                isShow: 'show',
                showTitle: 'hide'
              });
              //获取免打扰列表
              that.getList();
            }
          });
        }else {
          //获取免打扰列表
          that.getList();
        }
      }
    });
  },
  touchS: function (e) {
    if (this.data.isShow == 'hide') {
      return;
    } 
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (this.data.isShow == 'hide') {
      return;
    } 
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = 180;
      //获取手指触摸的是哪一项
      var target = e.target.dataset.target;
      if (target) {
        delBtnWidth = 90;
      }
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
      //星期左滑事件
      if (target) {
        var data = {};
        data[target] = txtStyle;
        this.setData(data);
      }
      //时段左滑事件
      else {
        var index = e.target.dataset.index;
        var idx = e.target.dataset.idx;
        var list = this.data.list;
        list[idx].timeList[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          list: list
        });
      }
    }
  },
  touchE: function (e) {
    if (this.data.isShow == 'hide') {
      return;
    } 
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = 180;
      //获取手指触摸的是哪一项
      var target = e.target.dataset.target;
      if (target) {
        delBtnWidth = 90;
      }
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //星期左滑事件
      if (target) {
        var data = {};
        data[target] = txtStyle;
        this.setData(data);
      } 
      //时段左滑事件
      else {
        var index = e.target.dataset.index;
        var idx = e.target.dataset.idx;
        var list = this.data.list;
        list[idx].timeList[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          list: list
        });
      }
    }
  },
  //开启关闭事件
  switchChange: function (e) {
      var that = this;
      var ST = e.detail.value ? '1' : '0';
      app.ajax({
        url: '/studentSecure/telephoneAndDisturbSwitchUpdate',
        data: { TY: 5, ST: ST },
        success: function (res) {
          wx.redirectTo({
            url: '../safety/notdisturb',
          })
        }
      });
  },
  //查询免打扰列表
  getList: function () {
    var that = this;
    app.ajax({
      url: '/studentSecure/listExemptDisturb',
      data: {},
      success: function (res) {
        var list = res.bizData.result;
        var dataList = [];
        for (var k = 0; k < list.length; k++) {
            var obj = list[k];
            var weekper = parseInt(obj.weekper);
            var timedef = parseInt(obj.timedef);
            var weekperStr = parseInt(weekper, 10).toString(2);
            var week = {};
            var data = {};
            //设置星期选中
            for (var i = 0; i < 7; i++) {
              var isOn = weekperStr.substring(i, i + 1);
              console.log(isOn);
              if (isOn == "1") {
                var place = weekperStr.length - i - 1;
                week['d' + place] = 'active';
              }
            }
            data.name = obj.silencename;
            var j = 0;
            var timeList = [];
            while (timedef >= 1) {
              j++;
              var ST = obj["stime" + j];
              var ET = obj["etime" + j];
              var name = "时段"+j;
              timeList.push({ name: name, time: ST + '~' + ET});
              timedef = timedef >> 1;
            }
            data.timeList = timeList;
            data.week = week;
            dataList.push(data);
        }
        that.setData({
          list: dataList
        });
      }
    });
  },
  weekModify: function(e) {
      this.setData({
        weekModalFlag: false,
        week: e.currentTarget.dataset.week
      });
  },
  weektap: function(e) {
      var id = e.currentTarget.dataset.id;
      var week = this.data.week;
      if(week[id] == 'active') {
        week[id] = '';
      }else {
        week[id] = 'active';
      }
      this.setData({
        week: week
      });
  },
  addtap: function() {
      var list = this.data.list;
      if (list[0].timeList.length == 8) {
        app.alert('最多可添加8个免扰时段');
        return;
      }
      this.setData({
        modalFlag: false,
        title: '添加免扰时段',
        add:true,
        stime: "",
        etime: "",
        place: (list[0].timeList.length+1)
      });
  },
  cancel: function() {
      this.setData({
        modalFlag: true, 
        weekModalFlag: true
      });
  },
  timeUpdate: function(e) {
      var place = e.currentTarget.dataset.place;
      var time = e.currentTarget.dataset.time;
      this.setData({
        place: place,
        stime: time.split('~')[0],
        etime: time.split('~')[1],
        add: false, 
        modalFlag: false,
        title: '修改免扰时段'
      });
  },
  weeksave: function() {
      var week = this.data.week;
      var weekper = 0;
      var that = this;
      for (var i = 0; i < 7; i++) {
        if (week["d"+i] == "active") {
          var cur = 1 << i;
          weekper += cur;
        }
      }
      app.ajax({
        url: '/studentSecure/updateExemptDisturb',
        data: {weekper: weekper, place: 0},
        success: function (res) {
          that.setData({
            weekModalFlag: true
          });
          wx.redirectTo({
            url: '../safety/notdisturb',
          })
        }
      });
  },
  timesave: function() {
      if (this.data.flag) {
        return;
      }
      this.data.flag = true;
      var stime = this.data.stime;
      var etime = this.data.etime;
      var add = this.data.add;
      var place = this.data.place;
      var list = this.data.list;
      var week = list[0].week;
      var weekper = 0;
      var that = this;
      for (var i = 0; i < 7; i++) {
        if (week["d" + i] == "active") {
          var cur = 1 << i;
          weekper += cur;
        }
      }
      if (!stime || !etime) {
        this.data.flag = false;
        app.alert("开始时间或结束时间不能为空。");
        return;
      }
      //开始时间
      var startTime = stime.substring(0, 2) + stime.substring(3);
      //结束时间	
      var endTime = etime.substring(0, 2) + etime.substring(3);
      if (parseInt(endTime) - parseInt(startTime) <= 0) {
        this.data.flag = false;
        app.alert("开始时间必须早于结束时间，请重新设置！");
        return;
      }
      app.ajax({
        url: '/studentSecure/updateExemptDisturb',
        data: { weekper: weekper, place: place, add: add,ST:stime,ET:etime},
        success: function (res) {
          if (res.bizData.code == "12") {
            app.alert("免扰时间段之间发生交叉，请修改后重新保存!");
          }else {
              wx.redirectTo({
                url: '../safety/notdisturb',
              })
          }
        },
        complete: function() {
          that.data.flag = false;
        }
      });
  },
  timedel: function(e) {
      var place = e.currentTarget.dataset.place;
      var list = this.data.list;
      var week = list[0].week;
      var weekper = 0;
      var that = this;
      for (var i = 0; i < 7; i++) {
        if (week["d" + i] == "active") {
          var cur = 1 << i;
          weekper += cur;
        }
      }
      app.confirm('确定删除吗？',function() {
          app.ajax({
            url: '/studentSecure/updateExemptDisturb',
            data: { weekper: weekper, place: place, del: true },
            success: function (res) {
              wx.redirectTo({
                url: '../safety/notdisturb',
              })
            }
          });
      });
  },
  bindStartTimeChange: function(e) {
    this.setData({
      stime: e.detail.value
    })
  },
  bindEndTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    })
  }
})
