//application.js
//获取应用实例
var app = getApp()
Page({
  data: {
    hideInfo: 'show',
    hideInput:'hide',
    mobile:'',
    code:'',
    stuNo:'',
    relation:'',
    schoolName:'',
    className:'',
    name:'',
    sex:'',
    array: ['爸爸', '妈妈', '哥哥', '姐姐', '爷爷', '奶奶','其它'],
    index:0,
    loading: false,
    disabled: false,
    isExistSchool: 'show',
    radioValue:1,
    stuShow:'hide',
    schoolShow:'hide',
    smobile:'',
    scode:'',
    studentNo:''
  },
  onLoad: function (data) {
    this.setData({
      mobile: data.mobile,
      code: data.code,
      stuShow: 'show'
    });
    // 不限制，可以添加多个学校(老师)
    // if (!data.isExistSchool || data.isExistSchool == 1) {
    //   this.setData({
    //     isExistSchool: 'hide'
    //   });
    // }else {
    //   this.setData({
    //     isExistSchool: 'show'
    //   });
    // }
  },
  stuInput: function(e) {
    this.data.stuNo = e.detail.value;
  },
  queryHandle: function (e) {
    //学生号长度8位
    if (this.data.stuNo.length < 8){
      app.alert("学生号或imei格式错误");
      return;
    }
    this.getStuInfo();
  },
  radioChange: function (e) {
    var value = e.detail.value;
    this.data.radioValue = value;
    if (value == 1) {
      this.setData({
        stuShow: 'show',
        schoolShow: 'hide',
        hideInfo: 'show'
      });
    }else {
      this.setData({
        stuShow: 'hide',
        schoolShow: 'show',
        hideInfo: 'hide'
      });
    }
  },
  bindPickerChange: function (e) {
    var isHide;
    if (e.detail.value == 6){ //其它
      isHide = 'show';
    }else{
      isHide = 'hide';
    }
    //显示选择关系
    this.setData({
      index: e.detail.value,
      hideInput: isHide
    })
  },
  smobileInput: function(e) {
    this.data.smobile = e.detail.value;
  },
  scodeInput: function (e) {
    this.data.scode = e.detail.value;
  },
  //其它填写的关系
  otherEventHandle: function(e){
    this.data.relatioin = e.detail.value;
  },
  //查询学生信息
  getStuInfo:function(){
    var that = this;
    var stuNo = this.data.stuNo.toLowerCase();
    var relation = this.data.relation;
    // if (that.data.code && stuNo.indexOf(that.data.code.toLowerCase()) == -1){
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '学生号错误！'
    //   });
    //   return;
    // }
    app.ajax({
      url: '/getStudentInfo',
      data: {stuNo: stuNo},
      success: function (res) {
        //展示内容
        var data = res.bizData;
        that.setData({
          name: data.name,
          className: data.className,
          sex: data.sex,
          schoolName: data.schoolName,
          studentNo: data.stuNo
        })
      },
      fail: function (res) {
        that.setData({
          name: "",
          className: "",
          sex: "",
          schoolName: "",
          studentNo: ""
        })
        app.alert(res.data.msg);
      }
    });
  },
  save: function() {
    var that = this;
    if (that.data.radioValue == 2) {
      that.addSchool();
      return;
    }
    //判断是否找到学生
    if(!this.data.schoolName){
      app.alert('请输入正确的学生号！');
      return;
    }
    //找到学生
    else{
      //保存信息
      var req = {};
      req.mobile = that.data.mobile ? that.data.mobile : '';
      req.stuNo = that.data.studentNo;
      req.relation = (that.data.index == 6 ? that.data.relatioin : that.data.array[that.data.index]);
      console.log(req);
      if (!req.relation){
        app.alert('请输入关系！');
        return;
      }
      this.setData({
        loading: true,
        disabled: true
      });
      //获取信息
      app.ajax({
        url: '/addStudent',
        data: req,
        success: function (res) {
          if (res.rtnCode == '020002') {
            app.alert('该学生号不存在！');
            that.setData({
              loading: false,
              disabled: false
            });
            return;
          }else {
            if (res.bizData == 2) {
              app.confirm("保存成功是否继续绑定设备?",function() {
                //跳转到应用页
                wx.redirectTo({
                  url: '../safety/addEquipment'
                })
              },function() {
                //跳转到应用页
                wx.redirectTo({
                  url: '../my/index'
                })
              })
            }else {
              //跳转到应用页
              wx.redirectTo({
                url: '../my/index'
              })
            }
            
          }
        },
        complete: function() {
          that.setData({
            loading: false,
            disabled: false
          });
        }
      });
    }
  },
  addSchool: function() {
    if (!this.data.smobile) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入手机号！'
      });
      return;
    }
    if (!this.data.scode) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入邀请码！'
      });
      return;
    }
    var param = {};
    param.mobile = this.data.smobile;
    param.schoolCode = this.data.scode;
    var that = this;
    //获取信息
    app.ajax({
      url: '/addSchool',
      data: param,
      success: function (res) {
        that.setData({
          loading: false,
          disabled: false
        });
        if (res.rtnCode == '020001') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '学校邀请码错误！'
          });
        } else if (res.rtnCode == '020003') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '老师手机号已经被使用！'
          });
        } else if (res.rtnCode == '020004') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '老师不存在！'
          });
        } else {
          //跳转到应用页
          wx.redirectTo({
            url: '../my/index'
          })
        }
      }
    });
  }
})
