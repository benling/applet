//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      // list1:[{icon:"/images/message/xuexiao.png",name:"学校公告",content:"受台风影响，明天全校放假!",time:"3分钟前",type:1},
      //   { icon: "/images/message/xitong.png", name: "系统消息", content: "微校园小程序正式上线......", time: "5分钟前", type: 2},
      //   { icon: "/images/message/shebei.png", name: "设备信息", content: "SOS被触发发出紧急警报，请......", time: "6分钟前", type: 3}],
      // list2: [{ icon: "/images/message/yuwen.png", name: "语文作业", content: "今天学的古诗默写10遍。", time: "3分钟前", type: 4 },
      //   { icon: "/images/message/shuxue.png", name: "数学作业", content: "数学试卷错的题目......", time: "5分钟前", type: 5 },
      //   { icon: "/images/message/yingyu.png", name: "英语作业", content: "英文单词默写10遍。", time: "6分钟前", type: 6 }]
      list: []
  },
  onLoad: function () {
      var that = this;
      //获取新消息
      app.ajax({
        url: "/message/count",
        data: {},
        success: function (res) {
          app.ajax({
            url: "/message/listMessageNew",
            data: {},
            success: function (res1) {
              var data = res1.bizData;
              var count = res.bizData;
              var list = that.data.list;
              //学校公告
              var schoolMessage = { icon: "/images/message/xuexiao.png", name: "校园通知",type: 1 };
              //系统消息
              var sysMessage = { icon: "/images/message/xitong.png", name: "系统消息",type: 2 };
              //设备消息
              var deviceMessage = {icon: "/images/message/shebei.png", name: "设备消息",type: 3 };
              //作业消息
              var homeworkMessage = { icon: "/images/message/homework.png", name: "作业消息",type: 4 };
              //考勤消息
              var checkMessage = { icon: "/images/message/kaoqin.png", name: "考勤消息", type: 5 };
              //考勤消息
              var teachMessage = { icon: "/images/message/teach.png", name: "教管消息", type: 6 };
              //获取当前选中信息
              app.getChoseInfo(function (choseInfo) {
                for (var i in data) {
                  var obj = data[i];
                  if (obj.type == 1) {
                    sysMessage.content = obj.content ? obj.content : "暂无消息";
                    sysMessage.time = obj.date;
                  }
                  if (obj.type == 2) {
                    schoolMessage.content = obj.content ? obj.content : "暂无消息";
                    schoolMessage.time = obj.date;
                  }
                  if (obj.type == 3) {
                    deviceMessage.content = obj.content ? obj.content : "暂无消息";
                    deviceMessage.time = obj.date;
                  }
                  if (obj.type == 4) {
                    homeworkMessage.content = obj.content ? obj.content : "暂无消息";
                    homeworkMessage.time = obj.date;
                  }
                  if (obj.type == 5) {
                    checkMessage.content = obj.content ? obj.content : "暂无消息";
                    checkMessage.time = obj.date;
                  }
                  if (obj.type == 6) {
                    teachMessage.content = obj.content ? obj.content : "暂无消息";
                    teachMessage.time = obj.date;
                  }
                }

                schoolMessage.count = count.schoolCount;
                sysMessage.count = count.systemCount;
                deviceMessage.count = count.deviceCount;
                homeworkMessage.count = count.homeworkCount;
                checkMessage.count = count.checkCount;
                teachMessage.count = count.teachCount;
                list.push(schoolMessage);
                list.push(sysMessage);
                list.push(deviceMessage);
                list.push(checkMessage);
                list.push(homeworkMessage);
                //非家长角色有教管消息
                if (choseInfo.roleId != 'N' && choseInfo.roleId != 'D'){
                  list.push(teachMessage);
                }
                that.setData({
                  list: list
                });
              });
            }
          });
        }
      });
  },
  unittap: function(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      app.goto('../message/school');
    } else if (type == 2) {
      app.goto('../message/system');
    } else if (type == 3) {
      app.goto('../message/equipment');
    } else if (type == 4) {
      app.goto('../message/homework');
    } else if (type == 5) {
      app.goto('../message/check');
    } else if (type == 6) {
      app.goto('../message/teach');
    }
  },
  //底部菜单事件处理函数
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    if (!url) {
      app.alert('努力建设中，敬请期待！');
      return;
    }
    wx.redirectTo({
      url: url
    })
  }
})
