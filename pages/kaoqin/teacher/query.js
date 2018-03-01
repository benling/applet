//获取应用实例
var app = getApp()
Page({
  data: {
    sdate: app.getDay(new Date(), -90),
    edate: app.getDay(new Date(),0),
    stime:"选取时间",
    etime:"选取时间",
    list:[],
    index:0
  },
  onLoad: function () {
    var that = this;
    //获取选中班级
    var classInfo = wx.getStorageSync('classInfo');
    app.ajax({
      url: '/teacherCheck/listStudent',
      data: { classId: classInfo.id},
      success: function (res) {
        var list = res.bizData;
        that.setData({
          list: list
        });
      }
    });
  },
  selectedStuEvent: function() {
    if(this.data.list.length == 0) {
      app.alert("暂无学生数据");
    }
  },
  choseStudentChange: function(e) {
    this.setData({
      index:e.detail.value
    });
  },
  bindStartTimeChange: function(e) {
    this.setData({
      stime:e.detail.value
    });
  },
  bindEndTimeChange: function (e) {
    this.setData({
      etime: e.detail.value
    });
  },
  querytap: function() {
    var stime = this.data.stime;
    var etime = this.data.etime;
    var index = this.data.index;
    var list = this.data.list;
    if (list.length == 0) {
      app.alert('请先选择学生');
      return;
    }
    var imei = list[index].imei;//'358614134961784';
    var name = list[index].name;//'张三';
    if (stime == '选取时间' || etime == '选取时间') {
      app.alert('开始时间或结束时间不能为空');
      return;
    }
    if (new Date(stime) > new Date(etime)) {
      app.alert('开始时间不能大于结束时间');
      return;
    }
    app.goto('../teacher/result?stime=' + stime + '&etime=' + etime + '&imei=' + imei + '&name=' + name);
  }
})
