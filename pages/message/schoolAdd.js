//获取应用实例
var app = getApp()
Page({
  data: {
    typeList: [{ name: '学校', id: 0 }, { name: '年级', id: 1 }, { name: '班级', id: 2 }, { name: '成员', id: 3 }],
    evaContent: '',
    hiddenLoading: true,
    tindex:0,
    tid:0,
    range:'全校',
    showModalStatus: false,
    height: 0,
    title:"",
    gradeList:[],
    classList:[],
    userList:[],
    tempList:[]
  },
  onLoad: function (param) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowHeight;
        that.setData({
          height: height
        });
      }
    });
    app.getChoseInfo(function (choseInfo) {
      //加载通讯录
      app.ajax({
        url: '/schoolMessage/list',
        data: {},
        success: function (res) {
          var list = res.bizData.listGrade;
          for (var k = 0; k < list.length; k++) {
            var grade = list[k];
            grade.open = false;
            for (var i = 0; i < grade.listClass.length; i++) {
              var listClass = grade.listClass[i];
              listClass.open = false;
              for (var j = 0; j < listClass.listInfo.length; j++) {
                var info = listClass.listInfo[j];
                //角色赋值
                if (info.roleId == 'A') {
                  info.roleName = '校长';
                } else if (info.roleId == 'B') {
                  info.roleName = '班主任';
                } else if (info.roleId == 'C') {
                  info.roleName = '任课老师';
                } else {
                  //家长
                  info.relation = info.relation;
                }
              }
            }
            if (res.bizData.roleId == 'D') {
              grade.listClass[0].open = true;
            }
          }
          if (choseInfo.roleId != 'A') {
            that.setData({
              typeList: [{ name: '班级', id: 2 }, { name: '成员', id: 3 }],
              range:'请选择班级',
              tid: 2
            });
          }
          that.data.tempList = res.bizData.listGrade;
          that.setData({
            role: res.bizData.roleId,
            contactList: res.bizData.listGrade,
          });
        }
      });
    });
  },
  //事件
  textBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
  },
  bindTypeChange: function (e) {
    var index = e.detail.value;
    var tid = this.data.typeList[index].id;
    var tempList = this.data.tempList;
    var range = '全校';
    if (tid == 1) {
      range = '选择年级'
    } else if (tid == 2) {
      range = '选择班级'
    } else if (tid == 3) { 
      range = '选择成员'
    }
    this.data.gradeList = [];
    this.data.classList = [];
    this.data.userList = [];
    this.setData({
      range: range,
      tindex: e.detail.value,
      contactList: tempList,
      tid: tid
    })
  },
  titleInput: function(e) {
    this.data.title = e.detail.value;
  },
  rangetap: function (e) {
    var currentStatu = e.currentTarget.dataset.status;
    //关闭  
    if (currentStatu == "close") {
      var index = this.data.tid;
      var range = '';
      if (index == 1) {
        var gradeList = this.data.gradeList;
        range = '选择年级';
        if (gradeList.length > 0) {
          range = '已选('+gradeList.length+')个年级';
        }
      } else if (index == 2) {
        var classList = this.data.classList;
        range = '选择班级';
        if (classList.length > 0) {
          range = '已选(' + classList.length + ')个班级';
        }
      } else if (index == 3) {
        var userList = this.data.userList;
        range = '选择成员';
        if (userList.length > 0) {
          range = '已选(' + userList.length + ')个成员';
        }
      }
      this.setData({
        range: range,
        showModalStatus: false
      });
    }
    // 显示  
    if (currentStatu == "open" && this.data.tid > 0) {
      this.setData({
        showModalStatus: true
      });
    }
  },
  gradeCBChange: function(e) {
      var value = e.detail.value;
      var index = e.currentTarget.dataset.gindex;
      var id = e.currentTarget.dataset.id;
      var list = this.data.contactList;
      if (value.length > 0) {
        this.data.gradeList.push(id);
        list[index].checked = true;
      }else {
        list[index].checked = false;
        var index = this.getIndex(this.data.gradeList, id);
        this.data.gradeList.splice(index, 1);
      }
      this.setData({
        contactList:list
      })
  },
  classCBChange: function (e) {
    var value = e.detail.value;
    var gindex = e.currentTarget.dataset.gindex;
    var cindex = e.currentTarget.dataset.cindex;
    var id = e.currentTarget.dataset.id;
    var list = this.data.contactList;
    if (value.length > 0) {
      this.data.classList.push(id);
      list[gindex].listClass[cindex].checked = true;
    } else {
      list[gindex].listClass[cindex].checked = false;
      var index = this.getIndex(this.data.classList, id);
      this.data.classList.splice(index, 1);
    }
    this.setData({
      contactList: list
    })
  },
  userCBChange: function (e) {
    var value = e.detail.value;
    var user = e.currentTarget.dataset.user;
    var userList = this.data.userList;
    var gindex = e.currentTarget.dataset.gindex;
    var cindex = e.currentTarget.dataset.cindex;
    var uindex = e.currentTarget.dataset.uindex;
    var list = this.data.contactList;
    if (value.length > 0) {
      userList.push(user);
      list[gindex].listClass[cindex].listInfo[uindex].checked = true;
    } else {
      for (var i in userList) {
        if (user.id == userList[i].id) {
          userList.splice(i, 1);
          break;
        }
      }
      list[gindex].listClass[cindex].listInfo[uindex].checked = false;
    }
    this.setData({
      contactList: list
    })
  },
  getIndex: function(array,str) {
    var index = -1;
    for(var i in array) {
      if(array[i] == str) {
        index = i;
        break;
      }
    }
    return index;
  },
  gradeTap: function (e) {
    if (this.data.tid == 1) {
      return;
    }
    var index = e.currentTarget.dataset.index;
    var list = this.data.contactList;
    list[index].open = !list[index].open;
    this.setData({
      contactList: list
    });
  },
  classTap: function (e) {
    if (this.data.tid == 2) {
      return;
    }
    var gindex = e.currentTarget.dataset.gindex;
    var cindex = e.currentTarget.dataset.cindex;
    var list = this.data.contactList;
    list[gindex].listClass[cindex].open = !list[gindex].listClass[cindex].open;
    this.setData({
      contactList: list
    });
  },
  formSubmit: function (e) {
    var that = this;
    var tindex = that.data.tid;
    var context = e.detail.value.context;
    var data = {};
    if (tindex == 1 && that.data.gradeList.length == 0) {
      app.alert('请选择年级!');
      return;
    } else if (tindex == 2 && that.data.classList.length == 0) {
      app.alert('请选择班级级!');
      return;
    } else if (tindex == 3 && that.data.userList.length == 0) {
      app.alert('请选择成员!');
      return;
    }
    if (!that.data.title || that.data.title.trim().length == 0) {
      app.alert('请输入标题!');
      return;
    }
    if (!context || context.trim().length == 0) {
      app.alert('请输入公告内容!');
      return;
    }
    that.setData({
      hiddenLoading:false
    });
    data.title = that.data.title;
    data.context = context;
    if (tindex == 1) {
      data.strId = that.data.gradeList.join('#');
    } else if (tindex == 2) {
      data.strId = that.data.classList.join('#');
    } else if (tindex == 3) {
      data.infoList = that.data.userList;
    }
    data.type = (parseInt(that.data.tid) + 1);
    //保存数据
    app.ajax({
      url: '/schoolMessage/add',
      data: data,
      header: { 'content-type': 'application/json'},
      success: function (res) {
        wx.redirectTo({
          url: '../message/school'
        })
      },
      complete: function() {
        that.setData({
          hiddenLoading: true
        });
      }
    });
  }
})
