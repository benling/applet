//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{},
      showModalStatus: false,
      evaContent: "",
      commentList:[]
  },
  onLoad: function (param) {
    var that = this;
    var item = JSON.parse(param.item);
    //获取评论
    app.ajax({
      url: '/schoolMessage/getDetails',
      data: { id: item.messageSendId },
      success: function (res) {
        for (var i in res.bizData) {
          var obj = res.bizData[i];
          obj.roleName = app.globalData.roleEnum[obj.roleId];
        }
        item.roleName = app.globalData.roleEnum[item.roleId];
        item.receiveRoleName = app.globalData.roleEnum[item.receiveRoleId];
        that.setData({
          item: item,
          commentList: res.bizData
        });
      }
    })
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  commenttap: function (e) {
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
  addcomment: function () {
    var item = this.data.item;
    var that = this;
    that.setData({
      disabled: true
    });
    setTimeout(function () {
      if (!that.data.evaContent || that.data.evaContent.trim().length == 0) {
        app.alert('请输入回复内容!');
        that.setData({
          disabled: false
        });
        return;
      }
      //评论
      app.ajax({
        url: '/schoolMessage/insertComment',
        data: { schoolMessageId: item.messageSendId, content: that.data.evaContent },
        success: function (res) {
          wx.redirectTo({
            url: "../message/schoolDetail?item=" + JSON.stringify(item)
          })
        },
        complete: function () {
          that.setData({
            disabled: false
          });
        }
      })
    }, 600);

  }
})
