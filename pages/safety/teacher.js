//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
    contactList: []  
  },
  onLoad: function () {
    var that = this;
    //加载通讯录
    app.ajax({
      url: '/teacherSecure/list',
      data: {},
      success: function (res) {
        var list = res.bizData;
        for (var k = 0; k < list.length; k++) {
          var grade = list[k];
          grade.open = false;
          for (var i = 0; i < grade.classList.length; i++) {
            var listClass = grade.classList[i];
            listClass.open = false;
          }
        }
        that.setData({
          contactList: res.bizData
        });
      }
    });
  },
  gradeTap: function (e) {
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
    list[gindex].classList[cindex].open = !list[gindex].classList[cindex].open;
    this.setData({
      contactList: list
    });
  },
  userTap: function(e) {
    //点击成员信息
    var data = e.currentTarget.dataset.user;
    var cname = e.currentTarget.dataset.cname;
    if(data.imei) {
      data.className = cname;
      app.goto('../safety/bindInfo?data=' + JSON.stringify(data));
    }else {
      app.goto('../safety/addEquipment?type=teacher&studentId=' + data.id);
    }
  }
})
