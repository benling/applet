//获取应用实例
var app = getApp()
Page({
  data: {
    height:0,
    radius:300,
    disabled:false
  },
  onLoad: function (param) {
    var that = this;
    //获取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        });
      }
    });
    //如果region参数存在说明是修改 不存在视为添加
    if (param.region) {
        var region = JSON.parse(param.region);
        this.setData({
            markers: [{
              iconPath: "/images/safety/ditu-active.png",
              id: 0,
              latitude: region.regionpoint.lat,
              longitude: region.regionpoint.lng,
              width: 20,
              height: 20,
              label: {
                color: "#FF0000",
                content: "300米",
                fontSize: 16,
              }
            }],
            circles: [{
              latitude: region.regionpoint.lat,
              longitude: region.regionpoint.lng,
              color: '#FF0000DD',
              fillColor: '#7cb5ec88',
              radius: region.regionpoint.point,
              strokeWidth: 1
            }],
            latitude: region.regionpoint.lat,
            longitude: region.regionpoint.lng,
            radius: region.regionpoint.point,
            id: region.regionid,
            name: region.name
        });
    }else {
        //获取用户当前地理位置
        this.getPosition();
    }
  },
  getPosition() {
    var that = this;
    wx.getLocation({
        type: 'gcj02',
        success: function(res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            that.setData({
              markers: [{
                iconPath: "/images/safety/ditu-active.png",
                id: 0,
                latitude: latitude,
                longitude: longitude,
                width: 20,
                height: 20,
                label: {
                  color: "#FF0000",
                  content: "300米",
                  fontSize: 16,
                }
              }],
              circles: [{
                latitude: latitude,
                longitude: longitude,
                color: '#FF0000DD',
                fillColor: '#7cb5ec88',
                radius: 300,
                strokeWidth: 1
              }],
              latitude: latitude,
              longitude: longitude
            });
        },
        fail: function() {
            app.alert("获取地理位置失败!");
        }
    });
  },
  sliderChange: function(e) {
      var value = e.detail.value;
      var list = this.data.circles;
      list[0].radius = value;
      var markers = this.data.markers;
      markers[0].label.content = value+"米";
      this.setData({
        circles:list,
        radius: value,
        markers: markers
      });
  },
  nameInput: function(e) {
      this.data.name = e.detail.value;
  },
  save: function() {
      var id = this.data.id;
      var name = this.data.name;
      var latitude = this.data.latitude;
      var longitude = this.data.longitude;
      var radius = this.data.radius;
      var that = this;
      if (!name) {
        app.alert('请填写围栏名称!');
        return;
      }
      var reg = /^([\u4E00-\uFA29]*[a-z]*[A-Z]*)+$/;
      if (!reg.test(name)) {
        app.alert("围栏名称只允许为英文或者汉字！");
        return;
      }
      that.setData({
        disabled:true
      })
      var url = '';
      var param;
      if (id) {
        url = '/studentSecure/updateElectronRail';
        param = { RID: id, NE: name, RE:radius};
      }else {
        url = '/studentSecure/addeLectronRail';
        param = { lat: latitude, lng: longitude, point: radius, name: name }
      }
      app.ajax({
        url: url,
        data: param,
        success: function (res) {
          wx.redirectTo({
            url: '../safety/electronFence'
          })
        },
        complete: function() {
          that.setData({
            disabled: false
          })
        }
      });
  }
})
