//index.js
var config = require('../../utils/config.js');
var functions = require('../../utils/functions.js');
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo:'',
    hasUserInfo:false,
    num:10,
    is_base: 0,
    keyword:null,
  //幻灯片
    slideUrls: [],

    typeNav:[
      {
        name:'电子',
        category: 1,
        img:'../../images/Mobilepay.png'
      },
      {
        name: '生活',
        category: 4,
        img: '../../images/Bagshop.png'
      },
      {
        name: '体育',
        category: 3,
        img: '../../images/Moneyprinter.png'
      },
      {
        name: '书籍',
        category: 2,
        img: '../../images/Basketfull.png'
      }
    ],
    goods:[]
  },

  /*自定义函数*/
  /**
 * 搜索功能
 */
  goodsSearch: function (e) {
    var title = functions.trim(e.detail.value.title);
    if (!title) {
      wx.showToast({
        title: '请输入搜索内容',
        duration:1000,
        icon: 'none',
        mask: true
      });
      return;
    } 
    this.setData({ keyword:''});
    wx.navigateTo({
      url: './list/list?title='+title,
    });
  },
   /**
   * 加载幻灯片
   */
  loadslide: function () {
    var urls = [];
    var that = this;
    wx.request({
      url: config.URL + '/easyto/public/index.php/getSlide',
      success: function (res) {
        if (res.data.length != 0) {
          for (var i = 0; i < res.data.length; i++) {
            var h = functions.judge(res.data[i].slide_url);
            if (h !== 'h') {
              res.data[i].slide_url = config.URL + res.data[i].slide_url;
            }
            urls.push(res.data[i].slide_url);
          }
        }
        that.setData({ slideUrls: urls });
      }
    });
  },
  /**
   * 加载更多物品
   */
  moregoods: function () {
  var goods = [];
  var that = this;
  var num = that.data.num;
    num += 10;
    wx.request({
      url: config.URL + '/easyto/public/index.php/getGoods',
      method: 'POST',
      data:{num:num},
      success: function (res) {
        if (res.data == null) {
          wx.showToast({
            title: '已经到底了',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          that.setData({ is_base: 1 });
          return;
        }
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].create_time = functions.time(res.data[i].create_time);

          res.data[i].goods_category = functions.classify(res.data[i].goods_category);

          var h = functions.judge(res.data[i].avatar_url);
          if (h !== 'h') {
            res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
          }
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
          goods.push(res.data[i]);
        }
        that.setData({ num: num });
        that.setData({ goods: goods });
        setTimeout(() => { wx.hideLoading()}, 1000);
      }
    });
  },
  /**
   * 加载最新物品
   */
  newgoods: function () {
    var goods = [];
    var that = this;
    var num = that.data.num;
    wx.request({
      url: config.URL + '/easyto/public/index.php/getGoods',
      method:'POST',
      data: { num: num },
      success: function (res) {
        if(res.data==null) {
          wx.showToast({
            title: '用户尚未发布物品',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          that.setData({ goods: [] });
          return;
        }
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].create_time = functions.time(res.data[i].create_time);

          res.data[i].goods_category = functions.classify(res.data[i].goods_category);

          var h = functions.judge(res.data[i].avatar_url);
          if (h !== 'h') {
            res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
          }
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
          goods.push(res.data[i]);
        }
        that.setData({ goods: goods });
      }
    });
  },
  onLoad: function (e) {
    var _this = this;
    _this.loadslide();
    //查看是否有缓存
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var useInfo = res.data;
        if (useInfo) {
          _this.setData({
            userInfo: useInfo,
            hasUserInfo: true
          })
        }
      },
      fail: function(){
        wx.showToast({
          title: '您尚未登陆',
          duration:1000,
          icon: 'none',
          mask: true
        });
      }
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '更新中',
      duration: 1000,
      mask: true
    });
    this.setData({ num: 10});
    this.setData({ is_base: 0 });
    this.newgoods();
    wx.stopPullDownRefresh();
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.is_base==1){
      wx.showToast({
        title: '已经到底了',
        duration: 1000,
        icon: 'none',
        mask: true
      });
      return;
    }
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中...',
       mask: true
    });
    this.moregoods();
  },
  onShow: function () {
    this.newgoods();
  }
});
