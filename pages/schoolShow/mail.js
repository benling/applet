//获取应用实例
var app = getApp()
Page({
  data: {
    list: [],
    choseInfo: {roleId:'A'}
  },
  onLoad: function () {
    var that = this; 
    app.getChoseInfo(function (choseInfo) {
      app.ajax({
        url: '/schoolRectorMail/list',
        data: {},
        success: function (res) {
          var result = res.bizData;
          if (result && result.length > 0) {
            for (var i in result) {
              var obj = result[i];
              obj.show = 'hide';
              if (obj.imgs) {
                var index = obj.imgs.indexOf(',');
                if (index > 0) {
                  var imgs = obj.imgs.split(',');
                  obj.imgList = imgs.length > 3 ? [imgs[0], imgs[1], imgs[2]] : imgs;
                  if (imgs.length > 3) {
                    obj.show = 'show';
                  }
                } else {
                  obj.imgList = [obj.imgs];
                }
              }
              if (obj.content && obj.content.length > 38) {
                obj.content = obj.content.substring(0, 38) + '......';
              }
              obj.roleName = app.globalData.roleEnum[obj.roleId];
            }
          }
          that.setData({
            list: result,
            choseInfo: choseInfo
          });
        }
      })
    });
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  },
  addtap: function() {
    app.goto('../schoolShow/mailAdd');
  },
  infotap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.goto('../schoolShow/mailInfo?id=' + id);
  }
})
