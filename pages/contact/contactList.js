//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
    contactList: [],
    role:"B"
  },
  onLoad: function () {
    var that = this;
    //加载通讯录
    app.ajax({
      url: '/contact/list',
      data: {},
      success: function (res) {
        var list = res.bizData.listGrade;
        for (var k = 0; k < list.length; k++) {
          var grade = list[k];
          if (k == 0) {
            grade.open = true;
          }else {
            grade.open = false;
          }
          for (var i = 0; i < grade.listClass.length;i++){
            var listClass = grade.listClass[i];
            listClass.open = false;
            for (var j = 0; j < listClass.listInfo.length;j++){
              var info = listClass.listInfo[j];
              //角色赋值
              if (info.roleId == 'A'){
                info.roleName = '校长';
              } else if (info.roleId == 'B') {
                info.roleName = '班主任';
              } else if (info.roleId == 'C') {
                info.roleName = '任课老师';
              } else {
                //家长
                info.relation = info.relation;
              }
            }
          }
          if (res.bizData.roleId == 'D') {
            grade.listClass[0].open = true;
          }
        }
        that.setData({
          role: res.bizData.roleId,
          contactList: res.bizData.listGrade
        });
      }
    });
  },
  gradeTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.contactList;
    list[index].open = !list[index].open;
    this.setData({
      contactList: list
    });
  },
  classTap: function (e) {
    var gindex = e.currentTarget.dataset.gindex;
    var cindex = e.currentTarget.dataset.cindex;
    var list = this.data.contactList;
    list[gindex].listClass[cindex].open = !list[gindex].listClass[cindex].open;
    this.setData({
      contactList: list
    });
  },
  userTap: function(e) {
    //点击成员信息
    var data = e.currentTarget.dataset.user;
    app.goto('../contact/contactInfo?data=' + JSON.stringify(data));
  }
})
