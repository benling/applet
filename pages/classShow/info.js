//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    commentList:[],
    showModalStatus: false,
    evaContent:"",
    disabled:false,
    menu:["",""],
    isLike:'2'
  },
  onLoad: function (param) {
    var that = this;
    var item = JSON.parse(param.item);
    var menu = ["active",""];
    if(param.type == 2) {
      menu = ["", "active"];
    }
    that.setData({
      menu: menu,
    });
    //查询班级动态列表
    app.ajax({
      url: '/classShow/details',
      data: { id: item.id},
      success: function (res) {
          var result = res.bizData.list;
          if (item.imgs) {
            var index = item.imgs.indexOf(',');
            if (index > 0) {
              var imgs = item.imgs.split(',');
              item.imgList = imgs;
            } else {
              item.imgList = [item.imgs];
            }
          }
          for(var i in result) {
            var obj = result[i];
            obj.roleName = app.globalData.roleEnum[obj.roleId];
          }
          that.setData({
            commentList: result,
            item: item,
            isLike:res.bizData.isLike
          });
      }
    })
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    app.goto(url);
  },
  liketap: function() {
    var item = this.data.item;
    var isLike = this.data.isLike;
    var that = this;
    //已经点过赞的不能重复点赞
    if (isLike == 1) {
      return;
    }
    //点赞操作
    app.ajax({
      url: '/classShow/praise',
      data: { id: item.id },
      success: function (res) {
        item.likeCount = (item.likeCount+1);
        that.setData({
          item: item,
          isLike: 1
        });
      }
    })
  },
  commenttap: function(e){
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
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  addcomment: function() {
    var item = this.data.item;
    var that = this;
    that.setData({
      disabled:true
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
        url: '/classShow/insertComment',
        data: { classShowId: item.id, content: that.data.evaContent },
        success: function (res) {
          item.commentCount = (item.commentCount+1);
          app.goto("../classShow/info?item=" + JSON.stringify(item));
        },
        complete: function() {
          that.setData({
            disabled: false
          });
        }
      })
    }, 600);
    
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
