//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    showModalStatus: false,
    height:0,
    choseInfo:{},
    listChoseInfo:[],
    messageCount: 0,
    validDate:"",
    validShow:false
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        that.setData({
          height: height
        });
      }
    });
    //有效期
    var that = this;
    app.ajax({
      url: '/package/getPackageEndTime',
      data: {},
      success: function (res) {
          that.setData({
            validDate: res.bizData
          });
      }
    });
    //获取新消息
    app.ajax({
      url: "/message/count",
      data: {},
      success: function (res) {
        var count = res.bizData.count;
        //赋值
        that.setData({
          messageCount: count
        });
      }
    });
    //获取当前选中信息
    app.getChoseInfo(function (choseInfo) {
      //查询学校/学生列表
      app.ajax({
        url: '/app/listChoseInfo',
        data: {},
        success: function (res) {
          var list = res.bizData.listChoseInfo;
          for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            if (obj.roleId != 'D') {
              if (choseInfo.schoolId == obj.schoolId &&
                choseInfo.teacherId == obj.teacherId) {
                obj.selected = true;
              }
            }else {
              if (choseInfo.schoolId == obj.schoolId &&
                choseInfo.studentId == obj.studentId) {
                obj.selected = true;
              }
            }
            if (obj.roleId == 'A') {
              obj.roleName = '校长';
            } else if (obj.roleId == 'B') {
              obj.roleName = '班主任';
            } else if (obj.roleId == 'C') {
              obj.roleName = '任课老师';
            }
          }
          choseInfo.roleName = app.globalData.roleEnum[choseInfo.roleId];
          that.setData({
            listChoseInfo: list,
            choseInfo: choseInfo
          });
          that.data.isExistSchool = res.bizData.isExistSchool;
        }
      });
    });
  },
  tologin: function() {
    app.goto("../login/login");
  },
  //点击应用
  appTap: function(e){
    var url = e.currentTarget.dataset.url;
    var id = e.currentTarget.dataset.id;
    var that = this;
    var choseInfo = that.data.choseInfo;
    if (id == 1 || id == 2 || id == 4) {
      //判断当前是否有选中学校/学生
      if (choseInfo.roleId == 'N') {//游客
        //没有选中，跳转到登陆输手机号页面
        app.goto('../login/login');
      } else if (id == 2 && choseInfo.roleId != 'D') {
        app.goto('../my/teacherAccount');
      }else {
        app.goto(url);
      }
    }else {
      app.goto(url);
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
  },
  roletap: function(e) {
    var currentStatu = e.currentTarget.dataset.status;
    //关闭  
    if (currentStatu == "close") {
      this.setData({
          showModalStatus: false
      });
    }
    // 显示  
    if (currentStatu == "open") {
      this.setData({
          showModalStatus: true
      });
    }  
  },
  //添加学校
  addSchool: function () {
    var that = this;
    var choseInfo = that.data.choseInfo;
    //获取选中信息
    if (choseInfo.roleId == 'N') {//游客
      //没有选中，跳转到登陆输手机号页面
      app.goto('../login/login');
    } else {
      //不是游客，添加学生或学校
      app.goto('../my/addSchool?isExistSchool=' + that.data.isExistSchool);
    }
  },
  //选择学校/学生
  choseInfoTap: function (e) {
    var info = e.currentTarget.dataset.info;
    app.ajax({
      url: '/app/setChoseInfo',
      data: info,
      success: function (res) {
        wx.redirectTo({
          url: '../my/index'
        });
      }
    });
  },
  viptap: function(e) {
    var validDate = this.data.validDate;
    if (validDate) {
      this.setData({
        validShow: !this.data.validShow
      });
    }
  }
})
