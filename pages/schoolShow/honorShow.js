//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url: '/schoolHonor/list',
      data: {},
      success: function (res) {
        var result = res.bizData;
        for(var i in result) {
          if (result[i].isLike == 1) {
            result[i].icon = "/images/common/xin1.png";
          }else {
            result[i].icon = "/images/common/xin.png";
          }
        }
        that.setData({
          list: result
        });
      }
    })
  },
  infotap: function(e) {
      var id = e.currentTarget.dataset.id;
      app.goto('../schoolShow/honorInfo?id=' + id);
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  },
  liketap: function(e) {
      var id = e.currentTarget.dataset.id;
      var index = e.currentTarget.dataset.index;
      var isLike = e.currentTarget.dataset.like;
      if (isLike == 1) {
        return;
      }
      var that = this;
      app.ajax({
        url: '/schoolHonor/like',
        data: {id:id},
        success: function (res) {
          var result = that.data.list;
          result[index].icon = "/images/common/xin1.png";
          result[index].likeCount = result[index].likeCount+1;
          result[index].isLike = 1;
          that.setData({
            list: result
          });
        }
      })
  }
})
