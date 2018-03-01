//获取应用实例
var app = getApp()
Page({
  data: {
    item: {},
    choseInfo:{},
    evaContent: '',
    disabled:false,
    isShow:false
  },
  onLoad: function (param) {
    var that = this;
    app.getChoseInfo(function (choseInfo) {
      app.ajax({
        url: '/schoolRectorMail/get',
        data: { id: param.id },
        success: function (res) {
          var obj = res.bizData;
          if (obj.imgs) {
            var index = obj.imgs.indexOf(',');
            if (index > 0) {
              var imgs = obj.imgs.split(',');
              obj.imgList = imgs;
            } else {
              obj.imgList = [obj.imgs];
            }
          }
          obj.roleName = app.globalData.roleEnum[obj.roleId];
          that.setData({
            item: obj,
            choseInfo: choseInfo,
            isShow:true
          });
        }
      })
    });
  },
  replytap: function() {
    var that = this;
    setTimeout(function() {
      var id = that.data.item.id;
      var evaContent = that.data.evaContent;
      if (!evaContent || that.data.evaContent.trim().length == 0){
        app.alert('请输入回复内容!');
        return;
      }
      that.setData({
        disabled: true
      });
      app.ajax({
        url: '/schoolRectorMail/updateMail',
        data: { id: id, replyContent: evaContent},
        success: function (res) {
          wx.redirectTo({
            url: '../schoolShow/mail',
          })
        },
        complete: function() {
          that.setData({
            disabled: false
          });
        }
      })
    },500)
    
  },
  //事件
  textAreaBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  },
  viewImgTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.item;
    var that = this;
    wx.previewImage({
      current: item.imgList[index],
      urls: item.imgList
    });
  }
})
