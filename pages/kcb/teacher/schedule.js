//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    cindex:0,
    classList:[]
  },
  onLoad: function () {
    var that = this;
    //获取班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        var classList = res.bizData;
        that.setData({
          classList: classList,
          className: classList[0].name
        });
        that.getScheduleList();
      }
    });
  },
  getScheduleList: function () {
    var that = this;
    var classList = that.data.classList;
    var cindex = that.data.cindex;
    //获取课程表数据
    app.ajax({
      url: '/schedule/listSchedule',
      data: { classId: classList[cindex].id },
      success: function (res) {
        var scheduleList = res.bizData;
        var mors = [];
        var afts = [];
        var cols = [];
        for (var i in scheduleList) {
          cols.push(scheduleList[i]);
          if (i % 7 == 6) {
            if (scheduleList[i].amPm == 1) {
              mors.push(cols);
            }else {
              afts.push(cols);
            }
            cols = [];
          }
        }
        that.setData({
          mors: mors,
          afts: afts,
          shwoPage: true
        });
      }
    });
  },
  classChange: function(e) {
    this.setData({
      cindex:e.detail.value
    });
    this.getScheduleList();
  },
  tktap: function(e) {
      var row = e.currentTarget.dataset.row;
      var col = e.currentTarget.dataset.col;
      var dayType = e.currentTarget.dataset.type;
      var rows = (dayType == 1 ? this.data.mors:this.data.afts);
      var that = this;
      var mors = this.data.mors;
      var afts = this.data.afts;
      //要调课的课程选中
      if (rows[row][col].isTeaching > 0) {
          //切换课程 取消选中
          for (var i in mors) {
            for (var j in mors[i]) {
              mors[i][j].isTwoTap = false;
            }
          }
          for (var i in afts) {
            for (var j in afts[i]) {
              afts[i][j].isTwoTap = false;
            }
          }
          //是否取消调课
          if (!rows[row][col].isFirstTap) {
              for (var i in mors) {
                for (var j in mors[i]) {
                  mors[i][j].isFirstTap = false;
                }
              }
              for (var i in afts) {
                for (var j in afts[i]) {
                  afts[i][j].isFirstTap = false;
                }
              }
              rows[row][col].isFirstTap = true;
              
          }else {
              rows[row][col].isFirstTap = false;
          }
          this.setData({
            mors: mors,
            afts: afts
          });
      } 
      //被调课的课程选中
      else if (rows[row][col].isOk == 1) {
          if (this.getTapStatus(rows)) {
              //切换课程 取消选中
              for (var i in mors) {
                for (var j in mors[i]) {
                  mors[i][j].isTwoTap = false;
                }
              }
              for (var i in afts) {
                for (var j in afts[i]) {
                  afts[i][j].isTwoTap = false;
                }
              }
              rows[row][col].isTwoTap = true;
              this.setData({
                mors: mors,
                afts: afts
              });
              app.confirm("确定进行调课吗?", function () {
                that.changeSchedule();
              });
          }
      }
      
  },
  changeSchedule: function() {
      var classId = this.data.classList[this.data.cindex].id;
      var sid = "";
      var pid = "";
      var mors = this.data.mors;
      var afts = this.data.afts;
      var that = this;
      //获取调课id和被调课id
      for (var i in mors) {
        for (var j in mors[i]) {
          if (mors[i][j].isFirstTap) {
            sid = mors[i][j].id;
          }
          if (mors[i][j].isTwoTap) {
            pid = mors[i][j].id;
          }
        }
      }
      //获取调课id和被调课id
      for (var i in afts) {
        for (var j in afts[i]) {
          if (afts[i][j].isFirstTap) {
            sid = afts[i][j].id;
          }
          if (afts[i][j].isTwoTap) {
            pid = afts[i][j].id;
          }
        }
      }
      if (!sid || !pid) {
        app.alert("调课参数错误");
        return;
      }
      
      //调课
      app.ajax({
        url: '/schedule/change',
        data: { classId: classId, sid: sid, pid: pid },
        success: function (res) {
          //调课成功刷新数据
          that.clean();
          app.alert("调课申请已经发送,对方同意后生效");
        },
        fail: function (res) {
          that.clean();
          var msg = res.data.msg ? res.data.msg : "请求数据发生异常.";
          app.alert(msg);
        }
      });
  },
  getTapStatus: function (rows) {
    var mors = this.data.mors;
    var afts = this.data.afts;
    var flag = false;
    for (var i in mors) {
      for (var j in mors[i]) {
        if (mors[i][j].isFirstTap) {
          flag = true;
          break;
        }
      }
    }
    for (var i in afts) {
      for (var j in afts[i]) {
        if (afts[i][j].isFirstTap) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  },
  clean: function() {
    var mors = this.data.mors;
    var afts = this.data.afts;
    for (var i in mors) {
      for (var j in mors[i]) {
        if (mors[i][j].isFirstTap) {
          mors[i][j].isFirstTap = false;
        }
        if (mors[i][j].isTwoTap) {
          mors[i][j].isTwoTap = false;
        }
      }
    }
    for (var i in afts) {
      for (var j in afts[i]) {
        if (afts[i][j].isFirstTap) {
          afts[i][j].isFirstTap = false;
        }
        if (afts[i][j].isTwoTap) {
          afts[i][j].isTwoTap = false;
        }
      }
    }
    this.setData({
      mors: mors,
      afts: afts
    });
  },
  bottomMenuTap: function(e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url,
    })
  }
})
