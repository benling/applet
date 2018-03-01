// pages/support/addly.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height:0,
    filePaths:[],
    result:[],
    evaContent:'',
    hiddenLoading:true,
    loadingText:'上传图片中',
    imgIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    })
  },
  choseImg: function() {
    var that = this;
    var filePaths = this.data.filePaths;
    if (filePaths && filePaths.length == 9) {
      app.alert('最多只能上传9张图片');
      return;
    }
    wx.chooseImage({
      count: 9 - filePaths.length,
      success: function(res) {
          for (var i in res.tempFilePaths) {
            filePaths.push(res.tempFilePaths[i]);
          }
          that.setData({
            filePaths: filePaths
          });
      }
    })
  },
  deltap: function(e) {
     var index = e.currentTarget.dataset.index;
     var filePaths = this.data.filePaths;
     filePaths.splice(index, 1);
     this.setData({
       filePaths: filePaths
     });
  },
  //事件
  textBlur: function (e) {
      this.setData({
        evaContent: e.detail.value
      });
  },
  formSubmit: function() {
    if (!this.data.evaContent || this.data.evaContent.trim().length == 0) {
      app.alert('请输入内容!');
      return;
    }
    this.setData({
      hiddenLoading: false
    });
    this.data.result = [];
    this.data.imgIndex = 0;
    this.uploadImage();
    
  },
  uploadImage: function() {
    var that = this;
    var filePaths = this.data.filePaths;
    //图片如果全部上传完毕 保存数据
    if (filePaths.length == that.data.imgIndex) {
      that.setData({
        loadingText: '保存数据中'
      });
      var imgs = that.data.result.join(',');
      var content = that.data.evaContent;
      app.ajax({
          url: '/supportPage/addFeedback',
          data: { imgs: imgs, content: content},
          success: function (res) {
            wx.redirectTo({
              url: '../support/liuyan'
            })
          },
          complete: function() {
            that.setData({
              hiddenLoading: true
            });
          }
      })
      return;
    }
    //上传图片
    wx.uploadFile({
      url: app.globalData.url + '/file/uploadFile.do',
      filePath: filePaths[that.data.imgIndex],
      name: 'img',
      method: 'POST',
      formData: {
      },
      success: function (res) {
        var data = res.data;
        data = JSON.parse(data);
        console.log(data.bizData);
        that.data.result.push(data.bizData);
        that.data.imgIndex = (that.data.imgIndex+1);
        that.uploadImage();
      },
      fail: function(e) {
          that.setData({
            hiddenLoading: true
          });
          app.alert("上传图片失败,请检查您的网络.");
      }
    });
  }
})