//获取应用实例
var app = getApp()
Page({
  data: {
    sindex: 0,
    cindex: 0,
    filePaths:[],
    classList:[],
    subList: [],
    result: [],
    evaContent: '',
    loadingText: '上传图片中',
    hiddenLoading: true,
    replyType:1,
    voiceList:[],
    btnTxt:"按住录音",
    audios:[],
    audioIndex:0,
    imgIndex:0
  },
  onLoad: function (param) {
    var that = this;
    //查询班级列表
    app.ajax({
      url: '/common/listClass',
      data: {},
      success: function (res) {
        //查询科目列表
        app.ajax({
          url: '/common/listSubject',
          data: {},
          success: function (res1) {
            that.setData({
              classList:res.bizData,
              subList: res1.bizData,
            });
          }
        })
      }
    })
  },
  choseImg: function () {
    var that = this;
    var filePaths = this.data.filePaths;
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
  bindSubjectChange: function (e) {
    this.setData({
      sindex: e.detail.value
    })
  },
  bindClassChange: function (e) {
    this.setData({
      cindex: e.detail.value
    })
  },
  radioChange: function (e) {
    this.data.replyType = e.detail.value;
  },
  formSubmit: function () {
    if (this.data.subList.length == 0) {
      app.alert('请选择科目!');
      return;
    }
    if (this.data.classList.length == 0) {
      app.alert('请选择班级!');
      return;
    }
    if (!this.data.evaContent || this.data.evaContent.trim().length == 0) {
      app.alert('请输入作业内容!');
      return;
    }
    this.data.result = [];
    this.data.audios = [];
    this.data.imgIndex = 0;
    this.data.audioIndex = 0;
    this.uploadImage();
  },
  uploadImage: function () {
    var that = this;
    var filePaths = this.data.filePaths;
    that.setData({
      hiddenLoading: false
    });
    //图片如果全部上传完毕 上传语音
    if (that.data.imgIndex == filePaths.length) {
      that.setData({
        loadingText: '上传语音中'
      });
      that.uploadAudio();
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
        console.log(res);
        data = JSON.parse(data);
        that.data.result.push(data.bizData);
        that.data.imgIndex = (that.data.imgIndex+1);
        that.uploadImage();
      },
      fail: function (e) {
        that.setData({
          hiddenLoading: true
        });
        app.alert("上传图片失败,请检查您的网络.");
      }
    });
  },
  uploadAudio: function() {
    var that = this;
    var audios = that.data.voiceList;
    //录音如果全部上传完毕 保存数据
    if (audios.length == that.data.audioIndex) {
      that.setData({
        loadingText: '保存数据中'
      });
      that.saveData();
      return;
    }
    wx.uploadFile({
      url: app.globalData.url + '/file/uploadAudio.do',
      filePath: audios[that.data.audioIndex].filePath,
      name: 'audio',
      method: 'POST',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: function (res) {
        var data = res.data;
        data = JSON.parse(data);
        that.data.audios.push(data.bizData);
        that.data.audioIndex = (that.data.audioIndex+1);
        that.uploadAudio();
      },
      fail: function (e) {
        that.setData({
          hiddenLoading: true
        });
        app.alert("上传失败,请检查您的网络.");
      },
      complete: function () {
        that.setData({
          hiddenLoading: true
        });
      }
    })
  },
  saveData: function (audios) {
    //封装数据保存
    var that = this;
    var audios = that.data.audios.join(',');
    var imgs = that.data.result.join(',');
    var content = that.data.evaContent;
    var classId = that.data.classList[that.data.cindex].id;
    var subId = that.data.subList[that.data.sindex].id;
    var subName = that.data.subList[that.data.sindex].name;
    var replyType = that.data.replyType;
    app.ajax({
      url: '/homework/addHomework',
      data: { classId: classId, imgs: imgs, content: content, subjectId: subId, subjectName: subName, replyType: replyType, audios: audios },
      success: function (res1) {
        wx.redirectTo({
          url: "../teacher/index"
        })
      },
      complete: function () {
        that.setData({
          hiddenLoading: true
        });
      }
    })
  },
  deltap: function (e) {
    var index = e.currentTarget.dataset.index;
    var filePaths = this.data.filePaths;
    filePaths.splice(index, 1);
    this.setData({
      filePaths: filePaths
    });
  },
  recordingStart: function() {
    var that = this;
    wx.getSetting({
      success: function (res) {
        var record = res.authSetting['scope.record'];
        console.log(res);
        if (record) {
          that.recording();
        }else {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              //that.recording();
            },
            fail() {
              app.alert("您拒绝了使用录音功能。");
            }
          })
        }
      }
    })
    
  },
  recording: function() {
    var that = this;
    var list = that.data.voiceList;
    if (list.length == 3) {
      app.alert("最多只能添加三段语音");
      return;
    }
    that.setData({
      btnTxt: "录音中..."
    });
    wx.startRecord({
      success: function (res) {
        var list = that.data.voiceList;
        var tempFilePath = res.tempFilePath;
        var obj = {};
        obj.filePath = tempFilePath;
        obj.status = 1;
        list.push(obj);
        that.setData({
          voiceList: list,
          btnTxt: "按住录音"
        });
      },
      fail: function () {
        that.setData({
          btnTxt: "按住录音"
        });
        app.alert("录音失败，请重新录音.");
      }
    });
  },
  recordingEnd: function() {
    wx.stopRecord();
  },
  playtap: function(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    var list = that.data.voiceList;
    var flag = false;
    //播放语音
    if (status == 1) {
      for (var i in list) {
        if (i != index && list[i].status == 2) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return;
      }
      wx.playVoice({
        filePath: url,
        complete: function () {
          list[index].status = 1;
          that.setData({
            voiceList: list
          });
        }
      })
      //替换gif图片
      list[index].status = 2;
      that.setData({
        voiceList: list
      });
    }
    //结束播放
    else {
      wx.stopVoice();
      list[index].status = 1;
      that.setData({
        voiceList: list
      });
    }
  },
  delVoiceTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.voiceList;
    list.splice(index,1);
    this.setData({
      voiceList: list
    });
  }
})
