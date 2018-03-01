//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    familys:'',
    modalFlag:true,
    name: '',
    mobile: '',
    numType:'',
    flag:false
  },
  onLoad: function () {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //查询情亲号码列表
    this.getList();
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
      var list = this.data.familys;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        familys: list
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
      var list = this.data.familys;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        familys: list
      });
    }
  },
  getList: function() {
    var that = this;
    app.ajax({
      url: '/studentSecure/listKinshipNumber',
      data: {},
      success: function (res) {
          var data = res.bizData.result;
          var familys = [];
          familys.push({name: data.keyname1, mobile: data.key1, icon: '/images/safety/1.png' });
          familys.push({name: data.keyname2, mobile: data.key2, icon: '/images/safety/2.png' });
          familys.push({name: data.keyname3, mobile: data.key3, icon: '/images/safety/3.png' });
          that.setData({
            familys: familys
          });
      }
    });
  },
  updatetap: function(e) {
    var name = e.currentTarget.dataset.name;
    var mobile = e.currentTarget.dataset.mobile;
    var numType = e.currentTarget.dataset.index;
    this.setData({
      modalFlag: false,
      name: name,
      mobile: mobile,
      numType: numType
    });
  },
  nameInput: function(e) {
    this.data.name = e.detail.value;
  },
  mobileInput: function (e) {
    this.data.mobile = e.detail.value;
  },
  cancel: function () {
    this.setData({
      modalFlag: true
    });
  },
  save: function () {
    if (this.data.flag) {
      return;
    }
    this.data.flag = true;
    var numType = this.data.numType;
    var name = this.data.name;
    var mobile = this.data.mobile;
    var that = this;
    //修改亲情号码A
    if (numType == 0) {
        var pattern = /^\d{1,15}$/gi;
        var reg = /^([\u4E00-\uFA29]*[a-z]*[A-Z]*)+$/;
        if (!name) {
          this.data.flag = false;
          app.alert('姓名不能为空!');
          return;
        }
        if (!mobile) {
          this.data.flag = false;
          app.alert('号码不能为空!');
          return;
        }
        if (!reg.test(name)) {
          this.data.flag = false;
          app.alert('姓名只允许为英文或者汉字！');
          return;
        }
        if (!pattern.test(mobile)) {
          this.data.flag = false;
          app.alert('号码格式不正确!');
          return;
        }
        app.ajax({
          url: '/studentSecure/updateMobileA',
          data: { newMobile: mobile, keyname1: name},
          success: function (res) {
            wx.redirectTo({
              url: '../safety/familyNum'
            })
          },
          complete: function () {
            that.data.flag = false;
          }
        });
    }
    //修改亲情号码B,C
    else {
        var data = {};
        var familys = that.data.familys;
        if (numType == 1) {
          var obj = familys[2];
          data.k2 = mobile;
          data.name2 = name;
          data.k3 = obj.mobile;
          data.name3 = obj.name;
        }else {
          var obj = familys[1];
          data.k3 = mobile;
          data.name3 = name;
          data.k2 = obj.mobile;
          data.name2 = obj.name;
        }
        app.ajax({
          url: '/studentSecure/addKinshipNumber',
          data: data,
          success: function (res) {
            wx.redirectTo({
              url: '../safety/familyNum',
            })
          },
          complete: function () {
            that.data.flag = false;
          }
        });
    }
  }
})
