//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list:[],
    page:1,
    flag:false
  },
  onLoad: function () {
    var that = this;
    //家庭作业
    app.ajax({
      url: '/homework/teacher/list',
      data: {page:1},
      success: function (res) {
        var list = res.bizData.rows;
        for(var i in list) {
          var obj = list[i];
          if (obj.imgs && obj.imgs.indexOf(",")> -1) {
            obj.imgs = obj.imgs.split(",");
          }else {
            obj.imgs = obj.imgs?[obj.imgs]:[];
          }
        }
        that.setData({
          list:res.bizData.rows
        });
      }
    });
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.flag) {
      return;
    }
    //家庭作业
    app.ajax({
      url: '/homework/teacher/list',
      data: { page: that.data.page+1 },
      success: function (res) {
          var rows = res.bizData.rows;
          var list = that.data.list;
          if (rows && rows.length > 0) {
              for(var i in rows) {
                var obj = rows[i];
                if (obj.imgs && obj.imgs.indexOf(",") > -1) {
                  obj.imgs = obj.imgs.split(",");
                } else {
                  obj.imgs = (obj.imgs ? [obj.imgs] : []);
                }
                list.push(obj);
              }
              that.setData({
                list: list,
                page: that.data.page + 1
              });
          }else {
            that.data.flag = true;
          }
      }
    });
  },
  addtap: function() {
    app.goto("../teacher/add");
  },
  homeworktap: function(e) {
      var id = e.currentTarget.dataset.id;
      app.goto("../teacher/studentList?id="+id);
  },
  deltap: function(e) {
    var id = e.currentTarget.dataset.id
    app.confirm("确定删除吗?", function() {
      //删除家庭作业
      app.ajax({
        url: '/homework/teacher/deleteHomeWork',
        data: { id: id },
        success: function (res) {
          wx.redirectTo({
            url: '../teacher/index',
          })
        }
      });
    });
    
  }
})
