//获取应用实例
var app = getApp()
Page({
  data: {
    item: {}
  },
  onLoad: function (param) {
    var that = this;
    console.log(param);
    app.ajax({
      url: '/supportPage/getInfo',
      data: {id:param.id},
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
            item:obj
        });
      }
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
