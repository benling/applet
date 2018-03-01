//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    list: [],
    checked:'',
    modalFlag: true,
    imgClass:'baba',
    no:'',
    nm:'',
    pc:'',
    flag:false
  },
  onLoad: function () {
    console.log(getCurrentPages());
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //获取开关状态
    app.ajax({
      url: '/studentSecure/telephoneAndDisturbSwitch',
      data: {TY:1},
      success: function (res) {
          var checked = false;
          if(res.bizData.result.st == '1') {
              checked = true;
          }
          that.setData({
              checked: checked
          });
      }
    });
    //获取允许来电列表
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
      var delBtnWidth = 180;
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
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = 180;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  //查询允许来电集合
  getList: function() {
    var that = this;
    app.ajax({
      url: '/studentSecure/allowTelephone',
      data: {},
      success: function (res) {
        var list = res.bizData.result;
        for (var i = 0; i < list.length;i++) {
          var obj = list[i];
          var name = obj.NM;
          obj.NM = name.substring(0,name.indexOf('_'));
          obj.icon = '/images/safety/' + name.substring(name.indexOf('_') + 1, name.length) + '.png';
          obj.iname = name.substring(name.indexOf('_') + 1, name.length);
        }
        that.setData({
          list: list
        });
      }
    });
  },
  //开启关闭事件
  switchChange: function(e) {
    var that = this;
    var ST = e.detail.value?'1':'0';
    app.ajax({
      url: '/studentSecure/telephoneAndDisturbSwitchUpdate',
      data: { TY: 1, ST: ST},
      success: function (res) {
        that.setData({
          checked: e.detail.value
        });
      }
    });
    
  },
  //添加 修改界面 图标点击事件
  imgtap: function(e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      imgClass: name
    });
  },
  //姓名输入事件
  nameInput: function(e) {
      this.data.name = e.detail.value;
  },
  //电话输入事件
  mobileInput: function (e) {
      this.data.mobile = e.detail.value;
  },
  //添加点击事件
  addtap: function() {
    if (this.data.list.length == 7) {
      app.alert("允许来电已达上限!");
      return;
    }
    this.setData({
      modalFlag:false,
      name: "",
      mobile: "",
      imgClass: "baba",
      no: "",
      title:'添加允许来电'
    });
  },
  //修改点击事件
  updatetap: function(e) {
    var no = e.currentTarget.dataset.id;
    var nm = e.currentTarget.dataset.nm;
    var pc = e.currentTarget.dataset.pc;
    var iname = e.currentTarget.dataset.iname;
    this.setData({
      modalFlag: false,
      title: '修改允许来电',
      name: nm,
      mobile: pc,
      imgClass: iname,
      no:no
    });
  },
  //删除点击事件
  deltap: function (e) {
    var no = e.currentTarget.dataset.id;
    app.confirm('确定删除吗?',function() {
        app.ajax({
          url: '/studentSecure/deleteAllowTelephone',
          data: {NO:no},
          success: function (res) {
            wx.redirectTo({
              url: '../safety/agreeCall'
            })
          }
        });
    });
    
  },
  //取消方法
  cancel: function() {
    this.setData({
      modalFlag: true
    });
  },
  //保存方法
  save: function() {
      if (this.data.flag) {
        return;
      }
      this.data.flag = true;
      var that = this;
      var no = this.data.no;
      var name = this.data.name;
      var mobile = this.data.mobile;
      var imgClass = this.data.imgClass;
      var reg = /^([\u4E00-\uFA29]*[a-z]*[A-Z]*)+$/;
      var pattern = /^\d{1,15}$/gi;
      var that = this;
      if (!name) {
          this.data.flag = false;
          app.alert('姓名不能为空!');
          return;
      }else if (!mobile) {
          this.data.flag = false;
          app.alert('电话不能为空!');
          return;
      } else if (!reg.test(name)) {
          this.data.flag = false;
          app.alert('姓名只允许为英文或者汉字！');
          return;
      } else if (!pattern.test(mobile)) {
          this.data.flag = false;
          app.alert('电话格式不正确!');
          return;
      }
      var url = '/studentSecure/addAllowTelephone';
      var data = { NM: name + '_' + imgClass, PC: mobile };
      //如果有no说明是修改操作
      if (no) {
        data.NO = no;
        url = '/studentSecure/updateAllowTelephone';
      }
      app.ajax({
        url: url,
        data: data,
        success: function (res) {
            wx.redirectTo({
              url: '../safety/agreeCall'
            })
        },
        complete: function () {
          that.data.flag = false;
        }
      });
  }
})
