//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    startDate:app.getDay(new Date(),0),
    endDate: app.getDay(new Date(), 15),
    disabled:false,
  },
  onLoad: function (param) {
    if (param.id) {
      var that = this;
      app.ajax({
        url: '/schedule/getCustom',
        data: { id: param.id},
        success: function (res) {
          that.setData({
            item: res.bizData
          });
        }
      });
    }
  },
  titleInput: function(e) {
      var item = this.data.item;
      item.className = e.detail.value;
      this.setData({
        item: item
      })
  },
  classDateChange: function(e) {
    var item = this.data.item;
    item.timeWeek = e.detail.value
    this.setData({
      item: item
    })
  },
  //事件
  textBlur: function (e) {
    var item = this.data.item;
    item.remark = e.detail.value;
    this.setData({
      item: item
    });
  },
  weektap: function(e) {
    var index = e.currentTarget.dataset.week;
    var item = this.data.item;
    item.timeWeek = index;
    this.setData({
      item: item
    });
  },
  startTimeChange: function(e) {
    var item = this.data.item;
    item.startTime = e.detail.value;
    this.setData({
      item: item
    });
  },
  endTimeChange: function (e) {
    var item = this.data.item;
    item.endTime = e.detail.value;
    this.setData({
      item: item
    });
  },
  formSubmit: function () {
    this.setData({
      disabled: true
    });
    var item = this.data.item;
    if (!item.className) {
      app.alert("标题不能为空");
      this.setData({
        disabled: false
      });
      return;
    }
    if (parseInt(item.startTime.replace(":", "")) > parseInt(item.endTime.replace(":", ""))) {
      app.alert("开始时间不能大于结束时间");
      this.setData({
        disabled: false
      });
      return;
    }
    //添加自定义课程表
    this.addCustomSchedule();
  },
  //添加自定义课程表
  addCustomSchedule: function () {
    var that = this;
    var item = this.data.item;
    var obj = {};
    var customList = [];
    obj.type = item.status;
    obj.timeWeek = item.timeWeek;
    obj.startTime = item.startTime;
    obj.endTime = item.endTime;
    obj.title = item.className;
    obj.content = item.remark;
    customList.push(obj);
    app.ajax({
      url: '/schedule/addCustom',
      header: { 'content-type': 'application/json' },
      data: { customList: customList,id:item.id},
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
