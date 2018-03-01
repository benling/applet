//获取应用实例
var app = getApp()
Page({
  data: {
    list:[]
  },
  onLoad: function () {
    var that = this;
    app.ajax({
      url:'/supportPage/listProduct',
      data:{},
      success: function(res) {
          var result = res.bizData;
          var list = [];
          if (result && result.length > 0) {
              for(var i in result) {
                var obj = that.getData(list, result[i].tags);
                var data = result[i];
                //转换日期格式
                var createTime = data.createTime.replace(new RegExp(/(-)/g), '/');
                data.createTime = app.getDay(new Date(createTime),0);
                if (obj) {
                  obj.childList.push(data);
                }else {
                  list.push({ name: result[i].tags, childList: [data]});
                }
              }
              that.setData({
                  list:list
              });
          }
      }
    })
  },
  getData: function(array,text) {
      var data; 
      for (var i in array) {
          var obj = array[i];
          if (obj.name == text) {
            data = obj;
            break;
          }
      }
      return data;
  },
  messagetap: function() {
      wx.redirectTo({
        url: '../support/liuyan'
      })
  },
  detailtap: function(e) {
    var obj = e.currentTarget.dataset.obj;
    app.goto('../support/sdetail?json=' + encodeURIComponent(JSON.stringify(obj)));
  }
})
