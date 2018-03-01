//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    classList:[],
    index: 0,
    choseInfo:{},
    queryType:4
  },
  onLoad: function () {
    var that = this;
    //查询选中角色
    app.getChoseInfo(function (choseInfo) {
      //查询班级列表
      app.ajax({
        url: '/common/listClass',
        data: {},
        success: function (res) {
          var result = res.bizData;
          that.setData({
            classList: result,
            choseInfo: choseInfo
          });
          that.queryData(result[0].id);
        }
      })
    });
  },
  bindPickerChange: function (e) {
    var that = this;
    var i = e.detail.value;
    var classId = this.data.classList[i].id;
    that.setData({
      index: i
    });
    this.queryData(classId);
  },
  chosetap: function(e) {
    var queryType =  e.currentTarget.dataset.type;
    var i = this.data.index;
    var classId = this.data.classList[i].id;
    this.setData({
      queryType: queryType,
    });
    this.queryData(classId, queryType);
  },
  queryData: function (classId) {
    var that =  this;
    var queryType = this.data.queryType;
    //查询考勤数据
    app.ajax({
      url: '/teacherCheck/checkDailyCount',
      data: { classId: classId, type: queryType },
      success: function (res1) {
        var item = res1.bizData;
        var count = parseInt(item.arrived) + parseInt(item.nonArrival);
        item.rate = 0;
        if (count > 0) {
          item.rate = Math.round((parseInt(item.arrived) / parseInt(count)).toFixed(2) * 100);
        }
        that.setData({
          item: item
        });
      }
    })
  }
})
