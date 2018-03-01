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
    index:0,
    isHide:2,
    imgIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //查询班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        var result = res.bizData;
        that.setData({
          classList: result
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
  checkboxChange: function (e) {
    var value = e.detail.value;
    if (value == 1) {
      value = 2
    }else {
      value = 1
    }
    this.setData({
      isHide: value
    });
  },
  formSubmit: function() {
    if (this.data.classList.length == 0) {
      app.alert('请选择班级!');
      return;
    }
    if (!this.data.evaContent || this.data.evaContent.trim().length == 0) {
      app.alert('请输入问题和意见!');
      return;
    }
    this.data.imgIndex = 0;
    this.data.result = [];
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
      var classId = that.data.classList[that.data.index].id;
      var isHide = that.data.isHide;
      app.ajax({
          url: '/schoolRectorMail/add',
          data: { classId: classId, imgs: imgs, content: content, isHide: isHide},
          success: function (res) {
            wx.redirectTo({
              url: '../schoolShow/mail'
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
    that.setData({
      hiddenLoading: false
    });
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
  },
  bindPickerChange: function(e) {
    //显示选择关系
    this.setData({
      index: e.detail.value
    })
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({
      url: url
    })
  }
})