//获取应用实例
var app = getApp()
Page({
  data: {
    week:[0,0,0,0,0,0,0],
    amStarttime:'',
    amEndtime:'',
    pmStarttime: '',
    pmEndtime: '',
    id:'',
    disabled: false
  },
  onLoad: function (param) {
    var that = this;
    var id = param.id;
    if(id) {
      //根据id查询作息时段
      app.ajax({
        url: '/teacherCheck/getCheckSetting',
        data: {id:id},
        success: function (res) {
          var item = res.bizData;
          var week = [];
          for (var i = 0; i < 7; i++) {
            var day = item.weekday.substring(i, i + 1);
            week.push(day);
          }
          that.setData({
            week: week,
            amStarttime: item.amIn,
            amEndtime: item.amOut,
            pmStarttime: item.pmIn,
            pmEndtime: item.pmOut,
            id: id
          });
        }
      });
    }
  },
  weektap: function(e) {
      var index = e.currentTarget.dataset.index;
      var week = this.data.week;
      if(week[index]== 0) {
        week[index] = 1;
      }else {
        week[index] = 0;
      }
      this.setData({
        week: week
      });
  },
  amStartTimeChange: function (e) {
    this.setData({
      amStarttime: e.detail.value
    })
  },
  amEndTimeChange: function (e) {
    this.setData({
      amEndtime: e.detail.value
    })
  },
  pmStartTimeChange: function (e) {
    this.setData({
      pmStarttime: e.detail.value
    })
  },
  pmEndTimeChange: function (e) {
    this.setData({
      pmEndtime: e.detail.value
    })
  },
  savetap: function () {
    this.setData({
      disabled: true
    });
    var amStarttime = this.data.amStarttime.replace(":", "");
    var amEndtime = this.data.amEndtime.replace(":", "");
    var pmStarttime = this.data.pmStarttime.replace(":", "");
    var pmEndtime = this.data.pmEndtime.replace(":", "");
    var am1 = this.data.amStarttime;
    var am2 = this.data.amEndtime;
    var pm1 = this.data.pmStarttime;
    var pm2 = this.data.pmEndtime;
    var weekday = "";
    var flag = false;
    var week = this.data.week;
    var that = this;
    for (var i in week) {
      weekday += week[i];
      if (week[i] == 1) {
        flag = true;
      }
    }
    //判断星期
    if (!flag) {
      app.alert("星期不能为空");
      this.setData({
        disabled: false
      });
      return;
    }
    //判断时间
    if (!am1 || !am2 || !pm1 || !pm2) {
      app.alert("请先选择时间");
      this.setData({
        disabled: false
      });
      return;
    }
    //判断时间
    if (amEndtime - amStarttime <= 0 || pmEndtime - pmStarttime <= 0 || pmStarttime - amEndtime <= 0) {
      app.alert("时间选取错误，请重新选取");
      this.setData({
        disabled: false
      });
      return;
    }
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    var id = this.data.id;
    //保存数据
    app.ajax({
      url: '/teacherCheck/updateCheckSetting',
      data: { id: id, amIn: am1, amOut: am2, pmIn: pm1, pmOut: pm2, weekday: weekday},
      success: function (res) {
        wx.redirectTo({
          url: '../teacher/rest',
        })
      }
    });
  }
})
