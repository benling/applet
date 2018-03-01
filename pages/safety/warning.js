//获取应用实例
var app = getApp()
Page({
  data: {
    warnings: [],
    sdate:"开始时间",
    edate:"结束时间",
    start: '2017-01-01',
    end: app.getDay(new Date(), 0),
    disabled:false,
    modalFlag: true,
    evaContent: "",
    hiddenLoading: true,
    alarmId:''
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
    //获取报警信息
    this.getList();
  },
  //获取报警信息
  getList: function(date1,date2) {
    var that = this;
    var param = {};
    if (date1 && date2) {
        param.ST = date1;
        param.ET = date2;
    }
    app.ajax({
      url:'/studentSecure/alertLog',
      data: param,
      success: function (res) {
          var data = res.bizData.result;
          if(data && data.length > 0) {
              for(var i in data) {
                var obj = data[i];
                if (obj.type == "电子围栏报警") {
                  obj.icon = "/images/safety/JB.png";
                } else if (obj.type == '低电报警') {
                  obj.icon = "/images/safety/low_power.png";
                  obj.desc = "学生设备电量低" + obj.status +"%，请尽快安排充电。"
                } else if (obj.type == '摘除设备报警') {
                  obj.icon = "/images/safety/remove_warning.png";
                  obj.desc = "您孩子取下了安全手表,请您注意孩子安全;位置为：" + obj.desc + '。'
                } else if (obj.type == 'SOS报警') {
                  obj.icon = "/images/safety/sos.png";
                  obj.desc ="您的孩子触发SOS求助，请尽快确认核实；位置为："+obj.desc+"。特此提醒！"
                }
              }
              
          }
          that.setData({
            warnings: data
          });
      },
      complete: function() {
        that.setData({
          disabled: false
        });
      }
    });
  },
  startDateChange: function(e) {
      var start = e.detail.value;
      this.setData({
        sdate: start
      });
  },
  endDateChange: function (e) {
      var end = e.detail.value;
      this.setData({
        edate: end
      });
  },
  viewmaptap: function(e) {
     var lat = e.currentTarget.dataset.lat;
     var lng = e.currentTarget.dataset.lng;
     wx.redirectTo({
       url: '../safety/location?lat='+lat+'&lng='+lng
     })
  },
  query: function() {
      var sdate = this.data.sdate;
      var edate = this.data.edate;
      if (!sdate || sdate == "开始时间") {
        app.alert("请选择开始时间！");
        return;
      }
      if (!edate || edate == "结束时间") {
        app.alert("请选择结束时间！");
        return;
      }
      sdate = sdate.replace(new RegExp("-", "gm"), "/");
      edate = edate.replace(new RegExp("-", "gm"), "/");
      var date1 = new Date(sdate+" 00:00");
      var date2 = new Date(edate + " 23:59");
      if (date1 > date2) {
          app.alert("开始时间不能大于结束时间！");
          return;
      }
      this.setData({
        disabled: true
      });
      this.getList(date1, date2);
  },
  shangbaotap: function (e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      modalFlag: false,
      alarmId: id
    });
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  //取消方法
  cancel: function () {
    this.setData({
      modalFlag: true
    });
  },
  //保存方法
  save: function () {
    var that = this;
    if (!that.data.hiddenLoading) {
      return;
    }
    that.setData({
      hiddenLoading: false
    })
    setTimeout(function () {
      var id = that.data.alarmId;
      var evaContent = that.data.evaContent;
      if (!evaContent) {
        app.alert("求助原因不能为空.");
        that.setData({
          hiddenLoading: true
        })
        return;
      }
      app.ajax({
        url: "/studentSecure/sendCaution",
        data: { alarmId: id, reason: evaContent },
        success: function (res) {
          if (res.bizData.Code == 0) {
            app.alert("求助发送成功");
            that.setData({
              modalFlag: true
            });
          } else if (res.bizData.Code == 4) {
            app.alert("已发送过求助,不能重复求助。");
          } else {
            app.alert("求助发送失败,请稍后重试!");
          }
        },
        complete: function () {
          that.setData({
            hiddenLoading: true
          })
        }
      });
    }, 500)
  }
})
