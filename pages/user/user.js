// pages/user/user.js
var config = require('../../utils/config.js');
var functions = require('../../utils/functions.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    tabVal: 0,
    releaseGoods: [],
    collectGoods: [],
    show:0
  },

  /*自定义函数*/
  bindViewTap: function (e) {
    var img = [e.currentTarget.dataset.img];
    wx.previewImage({
      urls: img,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 获取用户信息
  */
  gUserInfo:function(){
    var _this = this;
    wx.getUserInfo({
      success: (res)=>{
        var useInfo = res.userInfo;//用户信息
        app.globalData.userInfo = useInfo;
        _this.setData({
          userInfo: useInfo,
          hasUserInfo: true
        });
        wx.setStorage({//缓存
          key: 'userInfo',
          data: useInfo
        });
      }
    });
  },
  /**
   * 获取我发布的
  */
  myRelease:function(){
    var that = this;
    var releaseGoods = [];
    var thr_session = wx.getStorageSync('thr_session');
    wx.request({
      url: config.URL + '/easyto/public/index.php/myRelease',
      method: 'POST',
      data: {
        thr_session: thr_session
      },
      success: function (res) {
        if (res.data.length !==0) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].goods_img = [config.URL + res.data[i].goods_img];
            if (res.data[i].goods_img2) {
              res.data[i].goods_img.push(config.URL + res.data[i].goods_img2);
            }
            if (res.data[i].goods_img3) {
              res.data[i].goods_img.push(config.URL + res.data[i].goods_img3);
            }

            var h = functions.judge(res.data[i].avatar_url);
            if (h !== 'h') {
              res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
            }

            res.data[i].goods_category = functions.classify(res.data[i].goods_category);

            switch (res.data[i].is_audit) {
              case 0: res.data[i].is_audit = '未审核'; break;
              case 1: res.data[i].is_audit = '审核通过'; break;
              case 2: res.data[i].is_audit = '审核不通过';
            }
            switch (res.data[i].is_buy) {
              case 0: res.data[i].is_buy = '未卖出'; break;
              case 1: res.data[i].is_buy = '已卖出';
            }
            res.data[i].create_time = functions.time(res.data[i].create_time);
            releaseGoods.push(res.data[i]);
          }
        }
        that.setData({ releaseGoods: releaseGoods });
      }
    });
  },
  /**
  * 获取我收藏的
 */
  myCollect: function () {
    var that = this;
    var collectGoods = [];
    var thr_session = wx.getStorageSync('thr_session');
    wx.request({
      url: config.URL + '/easyto/public/index.php/myCollect',
      method: 'POST',
      data: {
        thr_session: thr_session
      },
      success: function (res) {
        if (res.data.length !== 0) {
          for (var i = 0; i < res.data.length; i++) {
            switch (res.data[i].is_approve) {
              case 0: res.data[i].is_approve = '未认证'; break;
              case 1: res.data[i].is_approve = '已认证';
            }
            res.data[i].goods_img = [config.URL + res.data[i].goods_img];
            if (res.data[i].goods_img2) {
              res.data[i].goods_img.push(config.URL + res.data[i].goods_img2);
            }
            if (res.data[i].goods_img3) {
              res.data[i].goods_img.push(config.URL + res.data[i].goods_img3);
            }

            var h = functions.judge(res.data[i].avatar_url);
            if (h !== 'h') {
              res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
            }
            
            res.data[i].goods_category = functions.classify(res.data[i].goods_category);

            switch (res.data[i].is_buy) {
              case 0: res.data[i].is_buy = '未卖出'; break;
              case 1: res.data[i].is_buy = '已卖出';
            }
            res.data[i].create_time = functions.time(res.data[i].create_time);
            collectGoods.push(res.data[i]);
          }
        }
        that.setData({ collectGoods: collectGoods });
      }
    });
  },
  /**
   * 关于页
  */
  goabout: function(){
    wx.navigateTo({
      url: './about/about',
    });
  },
  /*
    tab切换
  */
  tab: function (i) {
    var val = i.target.dataset.val - 0;
    this.setData({
      tabVal: val
    });
    if (i.target.dataset.val==1){
      this.myCollect();
    }
  },
  login_again:function(){
    var that = this;
    wx.removeStorage({
      key: 'userInfo',
      success(res) {
        that.gUserInfo();
      }
    });
    wx.removeStorage({
      key: 'thr_session',
      success(res) {
        wx.showToast({
          title: '已经清除缓存，请退出之后重新进入小程序',
          duration: 2000,
          icon: 'none',
          mask: true,
        }); 
      }
    });
  },
  /*↑ 自定义函数 ↑*/

  onLoad: function () {
    var _this = this;
    //查看是否有缓存
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        var useInfo = res.data;
        if (useInfo) {
          _this.setData({
            userInfo: useInfo,
            hasUserInfo: true
          });
        }
      }
    });
    function strlen(str) {
      var len = 0;
      for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1 
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          len++;
        }
        else {
          len += 2;
        }
      }
      return len;
    }
    var thr_session = wx.getStorageSync('thr_session');
    var length = strlen(thr_session);
    if (length>32){
      _this.setData({show:1});
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.myRelease();
    this.myCollect();
  },
})