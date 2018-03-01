//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: '/supportPage/listFeedback',
      data: {},
      success: function (res) {
        var result = res.bizData;
        if(result && result.length > 0 ) {
           for(var i in result) {
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
               }else {
                 obj.imgList = [obj.imgs];
               }
             }
             obj.roleName = app.globalData.roleEnum[obj.roleId];
           }
           that.setData({
             list: result
           });
        }
      }
    })
  },
  supporttap: function () {
    wx.redirectTo({
      url: '../support/support'
    })
  },
  addtap: function() {
    app.goto('../support/addly');
  },
  unittap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.goto('../support/lydetail?id=' + id);
  }
})
