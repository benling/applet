//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    classList:[],
    index: 0,
    choseInfo:{}
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
          //查询周排名
          app.ajax({
            url: '/classShow/count',
            data: { classId: result[0].id },
            success: function (res1) {
              var item = res1.bizData;
              var count = parseInt(item.commitCount) + parseInt(item.notCommitCount);
              item.rate = 0;
              if (count > 0) {
                item.rate = Math.round((parseInt(item.commitCount) / parseInt(count)).toFixed(2) * 100);
              }
              var list = item.homeworkFinishMarkScoreDtoList;
              if (list && list.length > 0) {
                var max = list[0].markScore;
                for (var i = 1; i < list.length; i++) {
                  var obj = list[i];
                  //计算宽度
                  var width = Math.round((parseInt(obj.markScore) / parseInt(max)).toFixed(2) * 420);
                  if (width < 90) {
                    width = 90;
                  }
                  obj.width = width;
                }
              }
              that.setData({
                item: item,
                classList: result,
                choseInfo: choseInfo
              });
            }
          })
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
    //查询周排名
    app.ajax({
      url: '/classShow/count',
      data: { classId: classId},
      success: function (res1) {
        var item = res1.bizData;
        var count = parseInt(item.commitCount) + parseInt(item.notCommitCount);
        item.rate = 0;
        if (count > 0) {
          item.rate = Math.round((parseInt(item.commitCount) / parseInt(count)).toFixed(2) * 100);
        }
        var list = item.homeworkFinishMarkScoreDtoList;
        if (list && list.length > 0) {
          var max = list[0].markScore;
          for (var i = 1; i < list.length; i++) {
            var obj = list[i];
            //计算宽度
            var width = Math.round((parseInt(obj.markScore) / parseInt(max)).toFixed(2) * 420);
            if (width < 90) {
              width = 90;
            }
            obj.width = width;
          }
        }
        that.setData({
          item: item,
        });
      }
    })
  }
})
