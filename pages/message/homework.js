//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    page: 1,
    flag: false
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: "/message/homework/list",
      data: {page:1},
      success: function (res) {
        var data = res.bizData.rows;
        for(var i in data) {
          var obj = data[i];
          if (obj.imgs && obj.imgs.indexOf(",") > -1) {
            var imgList = obj.imgs.split(",");
            obj.imgs = imgList.length > 3 ? [imgList[0], imgList[1], imgList[2]] : imgList;
          } else {
            obj.imgs = obj.imgs ? [obj.imgs] : [];
          }
          if(obj.content.length > 38) {
            obj.content = obj.content.substring(0, 38) + "...";
          }
        }
        that.setData({
          list: data
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
      url: '/message/homework/list',
      data: { page: that.data.page + 1 },
      success: function (res) {
        var rows = res.bizData.rows;
        var list = that.data.list;
        if (rows && rows.length > 0) {
          for (var i in rows) {
            var obj = rows[i];
            if (obj.imgs && obj.imgs.indexOf(",") > -1) {
              var imgList = obj.imgs.split(",");
              obj.imgs = imgList.length > 3 ? [imgList[0], imgList[1], imgList[2]] : imgList;
            } else {
              obj.imgs = obj.imgs ? [obj.imgs] : [];
            }
            if (obj.content.length > 38) {
              obj.content = obj.content.substring(0, 38)+"...";
            }
            list.push(obj);
          }
          that.setData({
            list: list,
            page: that.data.page + 1
          });
        } else {
          that.data.flag = true;
        }
      }
    });
  },
  detailtap: function (e) {
    var id = e.currentTarget.dataset.id;
    var hid = e.currentTarget.dataset.hid;
    var stuid = e.currentTarget.dataset.stuid;
    var list = this.data.list;
    var that = this;
    app.ajax({
      url: "/message/homework/read",
      data: { id: id },
      success: function (res) {
        for (var i in list) {
          if (list[i].id == id) {
            list[i].status = 1;
            break;
          }
        }
        that.setData({
          list: list
        });
        app.goto("../message/homeworkDetail?id=" + hid + "&stuid=" + stuid);
      }
    });
  }
})
