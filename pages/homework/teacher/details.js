//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    item:{},
    flowerList:[2,2,2,2,2],
    scoreList:[],
    evaContent:"",
    score:"",
    hiddenLoading: true,
    audioCtx:""
  },
  onLoad: function (param) {
    var that = this;
    //家庭作业
    app.ajax({
      url: '/homework/info',
      data: {homeworkId:param.id,studentId:param.stuid},
      success: function (res) {
        var obj = res.bizData;
        var scoreList = that.data.scoreList;
        if (obj.imgs && obj.imgs.indexOf(",")> -1) {
          obj.imgs = obj.imgs.split(",");
        }else {
          obj.imgs = obj.imgs?[obj.imgs]:[];
        }
        if (obj.replyImgs && obj.replyImgs.indexOf(",") > -1) {
          obj.replyImgs = obj.replyImgs.split(",");
        } else {
          obj.replyImgs = obj.replyImgs ? [obj.replyImgs] : [];
        }
        //语音
        var audioList = obj.audios.length > 0 ?obj.audios.split(","):[];
        var audios = [];
        if (audioList.length > 0) {
          for (var i in audioList) {
            audios.push({ filePath: audioList[i],status:1});
          }
        }
        obj.audios = audios;

        //回复语音
        var replyAudiosList = obj.replyAudios.length>0?obj.replyAudios.split(","):[];
        var replyAudios = [];
        if (replyAudiosList.length > 0) {
          for (var i in replyAudiosList) {
            replyAudios.push({ filePath: replyAudiosList[i], status: 1 });
          }
        }
        obj.replyAudios = replyAudios;
        
        //红花
        for (var i = 0; i < obj.markScore;i++) {
          scoreList[i] = 1;
        }
        that.setData({
          item: obj,
          scoreList: scoreList
        });
      }
    });
  },
  flowertap: function(e) {
    var index = e.currentTarget.dataset.index;
    var flowerList = this.data.flowerList;
    for (var i = 0; i < flowerList.length;i++) {
      if(i <= index) {
        flowerList[i] = 1;
      }else {
        flowerList[i] = 2;
      }
    }
    this.setData({
      flowerList: flowerList,
      score:index+1
    });
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  savetap: function() {
    this.setData({
      hiddenLoading:false
    });
    var item = this.data.item;
    var content = this.data.evaContent;
    var markScore = this.data.score;
    var that = this;
    if (!content || content.trim().length == 0) {
      app.alert("请输入点评内容");
      this.setData({
        hiddenLoading: true
      });
      return;
    }
    if (!markScore) {
      app.alert("请给出红花数");
      this.setData({
        hiddenLoading: true
      });
      return;
    }
    //批改作业
    app.ajax({
      url: '/homework/teacher/updateFinish',
      data: { homeworkId: item.homeworkId, id: item.fid, pid: item.pid, markScore: markScore, markContent: content},
      success: function (res) {
        wx.redirectTo({
          url: '../teacher/index'
        })
      },
      complete: function() {
        that.setData({
          hiddenLoading: false
        });
      }
    });
  },
  viewImgTap: function(e) {
      var index = e.currentTarget.dataset.index;
      var item = this.data.item;
      var that = this;
      wx.previewImage({
        current: item.imgs[index],
        urls:item.imgs
      });
  },
  viewReplyImgTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.item;
    var that = this;
    wx.previewImage({
      current: item.replyImgs[index],
      urls: item.replyImgs
    });
  },
  playtap: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    var item = that.data.item;
    var audios = item.audios;
    var flag = false;
    //播放语音
    if (status == 1) {
      for (var i in audios) {
        if (i != index && audios[i].status == 2) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return;
      }
      //替换gif图片
      audios[index].status = 2;
      that.setData({
        item: item
      });
      //下载播放音频文件
      wx.downloadFile({
        url: audios[index].filePath, //仅为示例，并非真实的资源
        success: function (res) {
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              audios[index].status = 1;
              that.setData({
                item: item
              });
            }
          })
        }
      })
    }
    //结束播放
    else {
      wx.stopVoice();
      audios[index].status = 1;
      that.setData({
        item: item
      });
    }
  },
  replyplaytap: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;
    var item = that.data.item;
    var audios = item.replyAudios;
    var flag = false;
    //播放语音
    if (status == 1) {
      for (var i in audios) {
        if (i != index && audios[i].status == 2) {
          flag = true;
          break;
        }
      }
      if (flag) {
        return;
      }
      //替换gif图片
      audios[index].status = 2;
      that.setData({
        item: item
      });
      //下载播放音频文件
      wx.downloadFile({
        url: audios[index].filePath, //仅为示例，并非真实的资源
        success: function (res) {
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              audios[index].status = 1;
              that.setData({
                item: item
              });
            }
          })
        }
      })
    }
    //结束播放
    else {
      wx.stopVoice();
      audios[index].status = 1;
      that.setData({
        item: item
      });
    }
  }
})
