//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
      item:{},
      showModalStatus: false,
      evaContent: "",
      commentList:[],
      range:'全校',
      rightRangeStatus: false,
  },
  onLoad: function (param) {
    var that = this;
    var id = param.id;
    var mtype = param.type;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        that.setData({
          height: height
        });
      }
    });
    if (id) {
      //获取详情
      app.ajax({
        url: '/schoolMessage/getReceiveInfo',
        data: { id: id, type: mtype},
        success: function (result) {
          var item = result.bizData;
          //获取评论
          app.ajax({
            url: '/schoolMessage/getDetails',
            data: { id: id },
            success: function (res) {
              for (var i in res.bizData) {
                var obj = res.bizData[i];
                obj.roleName = app.globalData.roleEnum[obj.roleId];
              }
              var range = '全校';
              if (item.type == 2) {
                var receiveRange = item.receiveRange.split(',');
                item.list = receiveRange;
                range = receiveRange.length+'个年级';
              } else if (item.type == 3) {
                var receiveRange = item.receiveRange.split(',');
                item.list = receiveRange;
                range = receiveRange.length + '个班级';
              } else if (item.type == 4) {
                var list = item.list;
                for(var i in list) {
                  var obj = list[i];
                  obj.roleName = app.globalData.roleEnum[obj.receiveRoleId];
                }
                range = list.length + '个成员';
              }
              that.setData({
                item: item,
                commentList: res.bizData,
                range: range
              });
            }
          })
        }
      })
    }
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  rangetap: function (e) {
    var currentStatu = e.currentTarget.dataset.status;
    //关闭  
    if (currentStatu == "close") {
      this.setData({
        rightRangeStatus: false
      });
    }
    // 显示  
    if (currentStatu == "open") {
      this.setData({
        rightRangeStatus: true
      });
    }
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
            url: "../message/mySchool?id=" + item.messageSendId + '&type=' + item.type
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
