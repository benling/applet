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
    classList:[],
    schoolList:[],
    subList:[],
    sindex:0,
    cindex: 0,
    subIndex: 0,
    rows:"",
    schoolId:"",
    disabled: false
  },
  onLoad: function () {
    var that = this;
    //获取选中角色
    app.ajax({
      url: '/app/getChoseInfo',
      data: app.getUserInfo(),
      success: function (res) {
        var choseInfo = res.bizData;
        that.setData({
          choseInfo: choseInfo,
        });
        if (choseInfo.roleId != "B") {
          that.setData({
            sindex: 1,
            shwoPage: true
          });
        }else {
          that.loadClass();
        }
      }
    });
    
  },
  loadClass: function() {
    var that = this;
    app.ajax({
      url: '/common/listSchoolClass',
      data: {},
      success: function (res) {
        var data = res.bizData;
        var schoolList = [];
        var subList = data.subjectList;
        schoolList.push(data.name);
        schoolList.push("自定义");
        subList.splice(0, 0, { name: "无", id: "1" });

        that.setData({
          schoolList: schoolList,
          classList: data.classList,
          subList: data.subjectList,
          schoolId: data.id
        });

        //获取学校课程表信息
        if (data.classList.length > 0) {
          that.getScheduleList(data.classList[0].id);
        }
      }
    });
  },
  getScheduleList: function(classId) {
    var that = this;
    //获取课程表数据
    app.ajax({
      url: '/schedule/listSchedule',
      data: { classId: classId },
      success: function (res) {
        var scheduleList = res.bizData;
        var rows = [];
        var obj = {};
        var list = [];
        for (var i in scheduleList) {
          var subId = scheduleList[i].subjectId;
          list.push(that.getIndexById(subId));
          if(i%7 == 6) {
            obj.list = list;
            obj.stime = scheduleList[i].startTime;
            obj.etime = scheduleList[i].endTime;
            rows.push(obj);
            obj = {};
            list = [];
          }
        }
        if (rows.length > 0) {
          that.isEdit = true; 
        }
        that.setData({
          rows: rows,
          shwoPage:true
        });
      }
    });
  },
  getIndexById: function(id) {
    var subList = this.data.subList;
    var index = 0;
    for (var i in subList) {
      var obj = subList[i];
      if(id == obj.id) {
        index = parseInt(i);
        break;
      }
    }
    return index;
  },
  schoolChange: function(e) {
    this.setData({
      sindex:e.detail.value
    });
  },
  classChange: function (e) {
    var classList = this.data.classList;
    var classId = classList[e.detail.value].id;
    this.getScheduleList(classId);
    this.setData({
      cindex: e.detail.value
    });
  },
  subChange: function(e) {
      var row = e.currentTarget.dataset.row;
      var col = e.currentTarget.dataset.col;
      var rows = this.data.rows;
      rows[row].list[col] = e.detail.value;
      this.setData({
        rows: rows
      });
  },
  rowStartTimeChange: function(e) {
      var row = e.currentTarget.dataset.row;
      var rows = this.data.rows;
      rows[row].stime = e.detail.value;
      this.setData({
        rows: rows
      });
  },
  rowEndTimeChange: function (e) {
      var row = e.currentTarget.dataset.row;
      var rows = this.data.rows;
      rows[row].etime = e.detail.value;
      this.setData({
        rows: rows
      });
  },
  addRowTap: function(e) {
    var rows = this.data.rows || [];
    rows.push({list:[0,0,0,0,0,0,0]});
    this.setData({
      rows: rows
    });
  },
  delRowTap: function(e) {
    var row = e.currentTarget.dataset.index;
    var rows = this.data.rows;
    rows.splice(row, 1);
    this.setData({
      rows: rows
    });
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
  formSubmit: function() {
    var sindex = this.data.sindex;
    var that = this;
    this.setData({
      disabled: true
    });
    //判断是学校课程表还是自定义
    if(sindex == 0) {
          var classList = this.data.classList;
          var rows = this.data.rows;
          if (classList.length == 0) {
            app.alert("没有找到班级数据");
            this.setData({
              disabled: false
            });
            return;
          }
          if (!rows || rows.length == 0) {
            app.alert("请先添加课程表信息");
            this.setData({
              disabled: false
            });
            return;
          }
          //周一到周五没有选科目
          var notExistSub = [];
          //没有选上下课时间
          var notExistTime = [];
          //上课时间大于下课时间
          var formatError = [];
          //时间排序错误
          var sortError = [];
          var flag = false;
          for (var i in rows) {
            for(var j in rows[i].list) {
              if(rows[i].list[j] == 0 && j<5) {
                notExistSub.push(parseInt(i)+1);
                break;
              }
            }
            
            if (!rows[i].stime || !rows[i].etime) {
              notExistTime.push(parseInt(i) + 1);
            }
            
            if (rows[i].stime && rows[i].etime) {
              var stimeInt = parseInt(rows[i].stime.split(":"));
              var etimeInt = parseInt(rows[i].etime.split(":"));
              var index = parseInt(i) + 1;
              if (stimeInt > etimeInt) {
                formatError.push(index);
              }
              if (index < rows.length && rows[index].stime) {
                var nextStimeInt = parseInt(rows[index].stime.split(":"));
                if (etimeInt > nextStimeInt) {
                  sortError.push(index + 1);
                }
              }
            }
            
          }
          if (notExistTime.length > 0) {
            app.alert("请选择第" + notExistTime.join(",") + "节课的上下课时间");
            this.setData({
              disabled: false
            });
            return;
          }
          if (formatError.length > 0) {
            app.alert("第" + formatError.join(",")+"节课的上课时间不能大于下课时间");
            this.setData({
              disabled: false
            });
            return;
          }
          if (sortError.length > 0) {
            app.alert("第" + sortError.join(",") + "节课的上课时间不能小于上一节课的下课时间");
            this.setData({
              disabled: false
            });
            return;
          }
          if (notExistSub.length > 0) {
            app.alert("请选择第" + notExistSub.join(",")+"节课周一到周五的科目");
            this.setData({
              disabled: false
            });
            return;
          }
          if (that.isEdit) {
            app.confirm("修改课程表会清空调课记录，是否继续?", function () {
              //添加学校课程表
              that.addSchoolSchedule();
            });
          }else {
            //添加学校课程表
            that.addSchoolSchedule();
          }
          
    }else {
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
    }
    
  },
  getSelectedWeek: function() {
    var weekObj = this.data.weekObj;
    var list = [];
    for(var i=0;i<7;i++) {
      if (weekObj["w"+i] == 1) {
        list.push(parseInt(i)+1);
      }
    }
    return list;
  },
  //添加学校课程表
  addSchoolSchedule: function() {
    var that = this;
    var classList = this.data.classList;
    var cindex = this.data.cindex;
    var classId = classList[cindex].id;
    var rows = this.data.rows;
    var subjectList = this.data.subList;
    var obj = {};
    var subList = [];
    for (var i in rows) {
      obj.classId = classId;
      for (var j in rows[i].list) {
        var index = rows[i].list[j];
        var sub = {};
        sub.subjectId = subjectList[index].id;
        sub.startTime = rows[i].stime;
        sub.endTime = rows[i].etime;
        sub.week = parseInt(j)+1;
        subList.push(sub);
      }
    }
    obj.list = subList;
    obj.schoolId = this.data.schoolId;
    app.ajax({
      url: '/schedule/addSchedule',
      header: { 'content-type': 'application/json' },
      data: obj,
      success: function (res) {
        wx.redirectTo({
          url: '../teacher/schedule'
        })
      },
      complete: function () {
        that.setData({
          disabled: false
        });
      }
    });
  },
  //添加自定义课程表
  addCustomSchedule: function() {
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
      data: { customList: customList},
      success: function (res) {
        wx.redirectTo({
          url: '../teacher/index'
        })
      },
      complete: function () {
        that.setData({
          disabled: false
        });
      }
    });
  }
})
