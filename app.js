//app.js
var config = require('utils/config.js');

App({
  
  onLaunch: function() {
    var _this = this;
    if (wx.getStorageSync('thr_session')) {
      return;
    }
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {
                  wx.request({
                    url: config.URL + '/easyto/public/index.php/getSess',
                    method: "POST",
                    data: {
                      code: code,
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    success: res => {
                      wx.setStorageSync('thr_session', res.data);
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
    //从缓存获取用户信息并赋值全局变量
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        var userInfo = res.data;
        if(userInfo){
          _this.globalData.userInfo = userInfo;
        }
      }
    });
  },
  globalData: {
    userInfo: null
  }
});