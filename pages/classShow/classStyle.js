//获取应用实例
var app = getApp()
Page({
  data: {
    list:[],
    choseInfo:{},
    modalFlag: true,
    iconList: [{ name: "1", value: 1,selected:true }, { name: "2", value: 5 }, { name: "3", value: 10 }, { name: "4", value: 30 }
      , { name: "5", value: 50 }, { name: "6", value: 100 }],
    money:1,
    cid:"",
    hiddenLoading:true
  },
  onLoad: function () {
    var that = this;
    //获取当前选中信息
    app.getChoseInfo(function (choseInfo) {
      //查询班级动态列表
      app.ajax({
        url: '/classShow/listClassShow',
        data: { type: 1 },
        success: function (res) {
          var result = res.bizData;
          for (var i in result) {
            var obj = result[i];
            var name;
            var status;
            //教师离职处理(离职不能打赏)
            if (obj.username.indexOf('#') > -1){
              var names = obj.username.split('#');
              name = names[0];
              status = names[1];
              obj.username = name;
              obj.status = status;
            }
            //非教师,默认未离职
            else{
              obj.status = '2';//未离职
            }
            obj.show = 'hide';
            if (obj.imgs) {
              var index = obj.imgs.indexOf(',');
              if (index > 0) {
                var imgs = obj.imgs.split(',');
                obj.imgList = imgs.length > 3 ? [imgs[0], imgs[1], imgs[2]] : imgs;
                if (imgs.length > 3) {
                  obj.show = 'show';
                }
              } else {
                obj.imgList = [obj.imgs];
              }
            }
            if (obj.content.length > 55) {
              obj.partContent = obj.content.substring(0,55)+"...";
            }else {
              obj.partContent = obj.content;
            }
            obj.roleName = app.globalData.roleEnum[obj.roleId];
          }
          that.setData({
            list: result,
            choseInfo: choseInfo
          });
        }
      })
    });
   
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    app.goto(url);
  },
  unittap: function(e) {
    var item = e.currentTarget.dataset.item;
    app.goto("../classShow/info?item=" + JSON.stringify(item)+"&type=1");
  },
  addtap: function () {
    app.goto("../classShow/addStyle?type=1");
  },
  hidetap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.confirm("确定屏蔽该动态吗?", function () {
      //屏蔽事件
      app.ajax({
        url: '/classShow/shield',
        data: { id: id },
        success: function (res) {
          app.goto("../classShow/classStyle");
        }
      })
    });
    
  },
  shangtap: function(e) {
    var id = e.currentTarget.dataset.id;
    var iconList = this.data.iconList;
    for (var i in iconList) {
      iconList[i].selected = false;
    }
    iconList[0].selected = true;
    this.setData({
      iconList: iconList,
      modalFlag: false,
      cid: id, 
      money:1
    })
  },
  selectImgTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var iconList = this.data.iconList;
    for (var i in iconList) {
      iconList[i].selected = false;
    }
    iconList[index].selected = true;
    var value = iconList[index].value;
    this.data.money = value;
    this.setData({
      money: value,
      iconList: iconList
    })
  },
  canceltap: function() {
    this.setData({
      modalFlag: true,
      value:0
    })
  },
  oktap: function (e) {
      this.setData({
        hiddenLoading:false
      })
      var that = this;
      var id = that.data.cid;
      var money = that.data.money;
      app.ajax({
        url:"/classShow/gift",
        data: { id: id, fee: money},
        success: function (res) {
          var data = res.bizData;
          wx.requestPayment({
            'timeStamp': data.timeStamp,
            'nonceStr': data.nonceStr,
            'package': data.packageInfo,
            'signType': data.signType,
            'paySign': data.paySign,
            'success': function () {
              that.setData({
                modalFlag: true,
                value: 0
              })
            },
            'fail': function (res) {
              var errMessage;
              if (!res) {
                errMessage = res;
              } else {
                errMessage = "用户放弃支付";
              }
              app.ajax({
                url: "/package/updatePayLogStatus",
                data: { id: data.busPayTransId, errMessage: errMessage, payOrderId: data.payOrderId },
                success: function (res) {

                }
              })
            }
          });
        },
        complete: function () {
          that.setData({
            hiddenLoading: true
          })
        }
      })
  }
})
