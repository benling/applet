//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      list:[],
      check: ["active", "", "", "", "", ""]
  },
  onLoad: function () {
      var that = this;
      //查询
      app.ajax({
        url: '/studyZone/list',
        data:{type:1},
        success: function (res) {
          var list = res.bizData;
          if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              var obj = list[i];
              if (obj.title && obj.title.length > 38) {
                obj.shortTitle = obj.title.substring(0, 38) + '...';
              }
            }
          }
          that.setData({
            list: list
          });
        }
      });
  },
  unittap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.goto('../parents/detail?id=' + id);
  },
  menutap: function(e) {
    var id = e.currentTarget.dataset.id;
    var that = this;
    //查询
    app.ajax({
      url: '/studyZone/list',
      data: { type: id },
      success: function (res) {
        var list = res.bizData;
        if (list && list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            if (obj.title && obj.title.length > 38) {
              obj.shortTitle = obj.title.substring(0, 38) + '...';
            }
          }
        }
        //设置菜单选中
        var check = that.data.check;
        for(var i in check) {
          check[i] = "";
        }
        check[id - 1] = "active";
        that.setData({
          list: list,
          check: check
        });
      }
    });
  }
})
