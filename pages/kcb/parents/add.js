//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    title:"",
    classDate:"",
    classType:1,
    evaContent:"",
    startDate:app.getDay(new Date(),0),
    endDate: app.getDay(new Date(), 15),
    dateList:[],
    stime:"",
    etime:"",
    weekObj:"",
    disabled:false,
  },
  onLoad: function (param) {
  },
  titleInput: function(e) {
      this.setData({
        title: e.detail.value
      })
  },
  classDateChange: function(e) {
    var dateList = this.data.dateList;
    var flag = false;
    for (var i in dateList) {
      if (dateList[i] == e.detail.value) {
        flag = true;
        break;
      }
    }
    if (flag) {
      app.alert("日期不能重复");
      return;
    }
    dateList.push(e.detail.value);
    this.setData({
      dateList: dateList,
      classDate: e.detail.value
    })
  },
  deltap: function(e) {
      var index = e.currentTarget.dataset.index;
      var dateList = this.data.dateList;
      dateList.splice(index, 1);
      this.setData({
        dateList: dateList
      })
  },
  radioChange: function(e) {
    this.setData({
      classType: e.detail.value
    })
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  weektap: function(e) {
    var i = e.currentTarget.dataset.index;
    var weekObj = this.data.weekObj||{};
    if (weekObj["w" + i] == 1) {
      weekObj["w" + i] = 2;
    }else {
      weekObj["w" + i] = 1;
    }
    this.setData({
      weekObj: weekObj
    });
  },
  startTimeChange: function(e) {
    this.setData({
      stime:e.detail.value
    });
  },
  endTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    });
  },
  formSubmit: function () {
    this.setData({
      disabled: true
    });
    var title = this.data.title;
    var evaContent = this.data.evaContent;
    var classType = this.data.classType;
    var stime = this.data.stime;
    var etime = this.data.etime;
    var dateList = this.data.dateList;
    if (!title) {
      app.alert("标题不能为空");
      this.setData({
        disabled: false
      });
      return;
    }
    if (classType == 1 && dateList.length == 0) {
      app.alert("至少需要选择一个日期");
      this.setData({
        disabled: false
      });
      return;
    }
    if (classType == 2 && this.getSelectedWeek().length == 0) {
      app.alert("至少需要选择一个星期");
      this.setData({
        disabled: false
      });
      return;
    }
    if (!stime) {
      app.alert("开始时间不能为空");
      this.setData({
        disabled: false
      });
      return;
    }
    if (!etime) {
      app.alert("结束时间不能为空");
      this.setData({
        disabled: false
      });
      return;
    }
    if (parseInt(stime.replace(":", "")) > parseInt(etime.replace(":", ""))) {
      app.alert("开始时间不能大于结束时间");
      this.setData({
        disabled: false
      });
      return;
    }
    //添加自定义课程表
    this.addCustomSchedule();

  },
  getSelectedWeek: function () {
    var weekObj = this.data.weekObj;
    var list = [];
    for (var i = 0; i < 7; i++) {
      if (weekObj["w" + i] == 1) {
        list.push(parseInt(i) + 1);
      }
    }
    return list;
  },
  //添加自定义课程表
  addCustomSchedule: function () {
    var that = this;
    var title = this.data.title;
    var evaContent = this.data.evaContent;
    var classType = this.data.classType;
    var stime = this.data.stime;
    var etime = this.data.etime;
    var dateList = this.data.dateList;
    var weeks = this.getSelectedWeek();
    var customList = [];
    var list = dateList;
    if (classType == 2) {
      list = weeks;
    }
    for (var i in list) {
      var obj = {};
      obj.type = classType;
      obj.timeWeek = list[i];
      obj.startTime = stime;
      obj.endTime = etime;
      obj.title = title;
      obj.content = evaContent;
      customList.push(obj);
    }
    app.ajax({
      url: '/schedule/addCustom',
      header: { 'content-type': 'application/json' },
      data: { customList: customList },
      success: function (res) {
        wx.redirectTo({
          url: '../parents/index'
        })
      },
      complete: function() {
        that.setData({
          disabled: false
        });
      }
    });
  }

})
