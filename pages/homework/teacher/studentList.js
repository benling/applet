//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function (param) {
    var that = this;
    //加载通讯录
    app.ajax({
      url: '/homework/teacher/listStudent',
      data: { homeworkId:param.id},
      success: function (res) {
        var list = res.bizData;
        //已批改的学生
        var list1 = [];
        //未批改的学生
        var list2 = [];
        //未提交的学生
        var list3 = [];
        for(var i in list) {
          var obj = list[i];
          if (obj.status == 1) {
            list3.push(obj);
          }else if (obj.status == 2) {
            list2.push(obj);
          }else if (obj.status == 3) {
            list1.push(obj);
          }
        }
        //封装数据
        var list = [];
        list.push({ name: "已批改作业",studentList:list1});
        list.push({ name: "未批改作业", studentList: list2 });
        list.push({ name: "未提交作业", studentList: list3 });
        that.setData({
          list: list
        });
      }
    });
  },
  categoryTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index].open = !list[index].open;
    this.setData({
      list: list
    });
  },
  userTap: function(e) {
    //点击成员信息
    var id = e.currentTarget.dataset.id;
    var stuid = e.currentTarget.dataset.stuid;
    app.goto('../teacher/details?id=' + id+'&stuid='+stuid);
  }
})
