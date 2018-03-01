//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    days:[],
    list:[],
    show:2,
    showpage:false,
    modalFlag: true
  },
  onLoad: function () {
    this.queryDaysList();
  },
  queryDaysList: function() {
    var that = this;
    var date = this.data.time;
    app.ajax({
      url: '/schedule/getCalendar',
      data: {},
      success: function (res) {
        var list = res.bizData;
        var dateStr = "";
        var queryWeek = "";
        var queryDate = "";
        for(var i in list) {
          if(list[i].status == 1) {
            dateStr = list[i].dateStr;
            queryWeek = list[i].week;
            queryDate = list[i].dateFormat;
            break;
          }
        }
        that.setData({
          days: list,
          dateStr: dateStr,
          queryWeek: queryWeek,
          queryDate:queryDate
        });
        setTimeout(function () {
          that.setData({
            toView: 'day'+(parseInt(list.length/2)-3),
            showpage: true
          });
        }, 500)
        //查询自定义课程表
        that.querySchedule();
      }
    });
  },
  querySchedule: function() {
    var dateStr = this.data.queryDate;
    var weekStr = this.data.queryWeek;
    var that = this;
    //获取考勤数据-家长端
    app.ajax({
      url: '/schedule/listRespSchedule',
      data: { day: dateStr, week:weekStr},
      success: function (res) {
        var data = res.bizData;
        var list = [];
        var colors = ['#fadbfd', '#fee8d6', '#ffd2d0', '#d5f2ff'];
        var cindex = 0;
        //课程数据
        for (var i in data) {
          var obj = data[i];
          obj.bgcolor = colors[cindex];
          cindex++;
          if (cindex >= colors.length) {
            cindex = 0;
          }
          list.push(obj);
        }
        that.setData({
          list: list
        });
      }
    });
  },
  daytap: function(e) {
      var index = e.currentTarget.dataset.index;
      var list = this.data.days;
      for (var i in list) {
        list[i].checked = false;
      }
      list[index].checked = true;
      this.setData({
        dateStr: list[index].dateStr,
        queryWeek: list[index].week,
        queryDate: list[index].dateFormat,
        days: list
      });
      //查询自定义课程表
      this.querySchedule();
  },
  detailTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    for(var i in list) {
      if(list[i].open && i != index) {
        list[i].open = false;
        break;
      }
    }
    list[index].open = !list[index].open;
    if (list[index].open) {
      var dotStyle = "border-bottom:20px solid " + list[index].bgcolor+";";
      var tipStyle = "top:45px;";
      list[index].dotClass = 'dot-top';
      if (list.length - index < 4 && list.length > 6) {
        dotStyle = "border-top:15px solid " + list[index].bgcolor + ";";
        tipStyle = "top:-130px;";
        list[index].dotClass = 'dot-bottom';
      }
      list[index].dotStyle = dotStyle;
      list[index].tipStyle = tipStyle;
    }
    this.setData({
      list:list
    });
  },
  addtap: function() {
    app.goto("../teacher/add")
  },
  deltap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var that = this;
    app.confirm("确定删除吗？", function () {
      //删除
      app.ajax({
        url: '/schedule/deleteCustom',
        data: { id: list[index].id },
        success: function (res) {
          list.splice(index, 1);
          that.setData({
            list: list
          });
        }
      });
    });

  },
  updatetap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if (list[index].type == 2) {
      app.goto("../teacher/edit?id=" + list[index].id);
    } else {
      this.data.flag = false;
      this.setData({
        modalFlag: false,
        index: index,
        remark: list[index].remark
      });
    }
  },
  cancel: function () {
    this.setData({
      modalFlag: true
    });
  },
  updateSchedule: function () {
    var list = this.data.list;
    var index = this.data.index;
    var that = this;
    if (that.data.flag) {
      return;
    }
    that.data.flag = true;
    setTimeout(function () {
      var remark = that.data.remark;
      //修改
      app.ajax({
        url: '/schedule/updateRemark',
        data: { id: list[index].id, remark: remark },
        success: function (res) {
          list[index].remark = remark;
          that.setData({
            list: list,
            modalFlag: true
          });
        }
      });
    }, 500);
  },
  textBlur: function (e) {
    this.setData({
      remark: e.detail.value
    });
  },
  bottomMenuTap: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  }
})
