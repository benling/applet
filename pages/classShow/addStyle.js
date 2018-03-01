//获取应用实例
var app = getApp()
Page({
  data: {
    index: 0,
    filePaths:[],
    classList:[],
    result: [],
    evaContent: '',
    loadingText: '上传图片中',
    hiddenLoading: true,
    classType:"",
    imgIndex:0
  },
  onLoad: function (param) {
    var that = this;
    //查询班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        var result = res.bizData;
        that.setData({
          classList: result,
          classType: param.type
        });
      }
    })
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    app.goto(url);
  },
  choseImg: function () {
    var that = this;
    var filePaths = that.data.filePaths;
    if (filePaths && filePaths.length == 9) {
      app.alert('最多只能上传9张图片');
      return;
    }
    wx.chooseImage({
      count: 9 - filePaths.length,
      success: function (res) {
        for (var i in res.tempFilePaths) {
          filePaths.push(res.tempFilePaths[i]);
        }
        that.setData({
          filePaths: filePaths
        });
      }
    })
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function () {
    var that = this;
    setTimeout(function() {
      if (that.data.classList.length == 0) {
        app.alert('请选择班级!');
        return;
      }
      if (!that.data.evaContent || that.data.evaContent.trim().length == 0) {
        app.alert('请输入内容!');
        return;
      }
      that.data.result = [];
      that.data.imgIndex = 0;
      that.uploadImage();
    },500);
    
  },
  uploadImage: function () {
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
      app.ajax({
        url: '/classShow/add',
        data: { classId: classId, imgs: imgs, content: content},
        success: function (res) {
          if (that.data.classType == 1) {
            wx.redirectTo({
              url: '../classShow/classStyle'
            })
          }else if (that.data.classType == 2) {
            wx.redirectTo({
              url: '../classShow/myStyle'
            })
          }
          
        },
        complete: function () {
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
        if (data.rtnCode == '000000') {
          that.data.result.push(data.bizData);
          that.data.imgIndex = (that.data.imgIndex + 1);
          that.uploadImage();
        }else {
          that.setData({
            hiddenLoading: true
          });
          app.alert(data.msg);
        }
      },
      fail: function (e) {
        that.setData({
          hiddenLoading: true
        });
        app.alert("上传图片失败,请检查您的网络.");
      }
    });
  },
  deltap: function (e) {
    var index = e.currentTarget.dataset.index;
    var filePaths = this.data.filePaths;
    filePaths.splice(index, 1);
    this.setData({
      filePaths: filePaths
    });
  }
})
