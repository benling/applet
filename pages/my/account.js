//获取应用实例
var app = getApp()
Page({
  data: {
    item:{}
  },
  onLoad: function () {
    var that = this;
    //查询周排名
    app.ajax({
      url: '/account/detail',
      data:{},
      success: function (res) {
        var item = res.bizData;
        if(item && item.list) {
          for(var i in item.list) {
            var obj = item.list[i];
            if(obj.payStatus == "1") {
              obj.result = "支付中"
            } else if (obj.payStatus == "2") {
              obj.result = "支付成功"
            } else if (obj.payStatus == "3") {
              obj.result = "支付失败"
            } else if (obj.payStatus == "4") {
              obj.result = "放弃支付"
            }
          }
        }
        that.setData({
          item: item
        });
      }
    })
  }
})
