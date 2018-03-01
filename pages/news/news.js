//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    news: [],
  },
  onLoad: function () {
    var that = this;
    //获取学校轮播图及新闻列表，不能使用公共的ajax方法否则会提示未授权，用户还没有选择是否授权
    app.ajax({
      url:'/schoolInfo/listSchoolNews',
      data: app.getUserInfo(),
      success: function (res) {
        var news = res.bizData;
        if (news && news.length > 0) {
          for (var i = 0; i < news.length;i++) {
            var obj = news[i];
            if (obj.digest && obj.digest.length > 16) {
              obj.digest = obj.digest.substring(0,16)+'...';
            }
            if (obj.title && obj.title.length > 25) {
              obj.shortTitle = obj.title.substring(0, 25) + '...';
            }
          }
        }
        that.setData({
          news: news
        });
      }
    });
  },
  newsTap: function(e) {
    var obj = e.currentTarget.dataset.obj;
    app.goto('../news/newsDetail?data=' + encodeURIComponent(JSON.stringify(obj)));
  }
})
