//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    roleId:'D',
    mtype:'1'
  },
  onLoad: function () {
    var that = this;
    //获取选中的角色
    app.getChoseInfo(function (choseInfo) {
      that.setData({
        roleId: choseInfo.roleId
      });
      that.getMessageList(1);
    });
  },
  detailtap: function (e) {
    var item = e.currentTarget.dataset.obj;
    var list = this.data.list;
    var that = this;
    var mtype = that.data.mtype;
    app.ajax({
      url: "/message/school/read",
      data: { id: item.id },
      success: function (res) {
        for (var i in list) {
          if (list[i].id == item.id) {
            list[i].status = 1;
            break;
          }
        }
        that.setData({
          list: list
        });
        if (mtype == 1) {
          app.goto('../message/schoolDetail?item=' + JSON.stringify(item));
        }else {
          app.goto('../message/mySchool?id=' + item.id + '&type=' + item.type);
        }
      }
    });
  },
  addtap: function() {
    app.goto("../message/schoolAdd");
  },
  menutap: function(e) {
    var mtype = e.currentTarget.dataset.type;
    this.setData({
      mtype:mtype
    });
    this.getMessageList(mtype);
  },
  getMessageList: function (mtype) {
    var that = this;
    var url = "/message/school/list";
    if (mtype == 2) {
      url = "/schoolMessage/listSend";
    }
    //获取消息列表
    app.ajax({
      url: url,
      data: {},
      success: function (res) {
        var data = res.bizData;
        for (var i in data) {
          var obj = data[i];
          if (obj.context.length > 38) {
            obj.partContext = obj.context.substring(0, 38) + "...";
          } else {
            obj.partContext = obj.context;
          }
        }
        that.setData({
          list: data
        });
      }
    });
  }
})
