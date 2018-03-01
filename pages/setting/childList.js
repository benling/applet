//获取应用实例
var app = getApp()
Page({
  data: {
    listChoseInfo:[]
  },
  onLoad: function(){
      var that = this;
      //查询学校/学生列表
      app.ajax({
        url: '/app/listChoseInfo',
        data: {},
        success: function (res) {
          var list = res.bizData.listChoseInfo;
          var temp = [];
          for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            if (obj.roleId == 'D') {
              temp.push(obj);
            } 
          }
          that.setData({
            listChoseInfo: temp
          });
        }
      });
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = 90;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.listChoseInfo;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        listChoseInfo: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = 90;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.listChoseInfo;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        listChoseInfo: list
      });
    }
  },
  deltap: function(e) {
    var refId = e.currentTarget.dataset.id;
    var parentsId = e.currentTarget.dataset.pid;
    var studentId = e.currentTarget.dataset.sid;
    app.confirm("确定解绑吗?",function() {
      app.ajax({
        url: '/setting/unbound',
        data: { refId: refId, parentsId: parentsId, studentId: studentId},
        success: function (res) {
          wx.redirectTo({
            url: '../my/index',
          })
        }
      });
    });
  }
})
