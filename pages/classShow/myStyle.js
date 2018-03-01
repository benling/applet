//获取应用实例
var app = getApp()
Page({
  data: {
    list: []
  },
  onLoad: function () {
    var that = this;
    //查询班级动态列表
    app.ajax({
      url: '/classShow/listClassShow',
      data: { type: 2 },
      success: function (res) {
        var result = res.bizData;
        if (result && result.length > 0) {
          for (var i in result) {
            var obj = result[i];
            var name;
            var status;
            //教师离职处理(离职不能打赏)
            if (obj.username.indexOf('#') > -1) {
              var names = obj.username.split('#');
              name = names[0];
              status = names[1];
              obj.username = name;
              obj.status = status;
            }
            //非教师,默认未离职
            else {
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
              obj.partContent = obj.content.substring(0, 55) + "...";
            } else {
              obj.partContent = obj.content;
            }
            obj.roleName = app.globalData.roleEnum[obj.roleId];
          }
          that.setData({
            list: result
          });
        }
      }
    })
  },
  menutap: function (e) {
    var url = e.currentTarget.dataset.url;
    app.goto(url);
  },
  unittap: function (e) {
    var item = e.currentTarget.dataset.item;
    app.goto("../classShow/info?item=" + JSON.stringify(item) + "&type=2");
  },
  addtap: function () {
    app.goto("../classShow/addStyle?type=2");
  },
  deltap: function(e) {
    var id = e.currentTarget.dataset.id;
    app.confirm("确定删除吗?", function() {
      //删除事件
      app.ajax({
        url: '/classShow/delete',
        data: { id: id },
        success: function (res) {
          app.goto("../classShow/myStyle");
        }
      })
    });
    
  }
})
