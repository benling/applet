//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    messageCount:0,
    choseInfo:{},
    hiddenLoading:false
  },
  onLoad: function () {
    var that = this;
    //获取新消息
    app.ajax({
      url: "/message/count",
      data: {},
      success: function (res) {
        //统计登陆次数
        that.countLogin();
        //获取选中角色
        app.ajax({
          url: '/app/getChoseInfo',
          data: app.getUserInfo(),
          success: function (res1) {
            var choseInfo = res1.bizData;
            var count = res.bizData.count;
            //赋值
            that.setData({
              choseInfo: choseInfo,
              messageCount: count
            });
             
          },
          complete: function() {
            that.setData({
              hiddenLoading: true
            });
          }
        });
      }
    });
   
  },
  countLogin: function() {
    //统计登陆次数
    app.ajax({
      url: '/loginCount',
      data: {},
      success: function (res) {

      }
    });
  },
  //点击应用
  appTap: function(e){
    var url = e.currentTarget.dataset.url;
    var id = e.currentTarget.dataset.id;
    var that = this;
    //判断当前菜单是否可用
    if (!url) {
      app.alert('努力建设中，敬请期待！');
      return;
    }
    if (id == 5 || id == 10) {
      app.goto(url);
      return;
    }
    app.ajax({
      url:'/app/getChoseInfo',
      data: app.getUserInfo(),
      success: function (res) {
        var choseInfo = res.bizData;
        //判断当前是否有选中学校/学生
        if (choseInfo.roleId == 'N') {//游客
          //没有选中，跳转到登陆输手机号页面
          app.goto('../login/login');
        } else {
          //学生安全-家长
          if (id == 1 && choseInfo.roleId == 'D'){
            //获取新消息
            app.ajax({
              url: "/package/getPackageStatus",
              data: {},
              success: function (res) {
                //套餐未到期
                if (res.bizData == 1) {
                  //没绑定设备
                  if (!choseInfo.imei){
                    app.goto('../safety/addEquipment');
                    return;
                  }
                  //已绑定设备
                  else{
                    app.goto(url);
                    return;
                  }
                }
                //套餐已到期
                else{
                  app.goto('../pay/pay');
                  return;
                }
              }
            });
          }
          //学生安全-教师
          else if (id == 1 && choseInfo.roleId != 'D') {
            app.goto('../safety/teacher');
            return;
          }
          //家庭作业-家长端
          else if (id == 3 && choseInfo.roleId == 'D') {
            app.goto('../homework/parents/index');
            return;
          }
          //考勤-家长端
          else if (id == 15 && choseInfo.roleId == 'D') {
            app.goto('../kaoqin/parents/index');
            return;
          }
          //跳转页面传入的url
          else{
            app.goto(url);
          }
        }
      }
    });
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
