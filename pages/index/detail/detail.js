// pages/index/detail/detail.js
var config = require('../../../utils/config.js');
var functions = require('../../../utils/functions.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_title: null,
    goods_prom_price: null,
    goods_img: [],
    nick_name: null,
    goods_abstract: null,
    is_collect: '收藏☆',
    phone_number: null,
    wechat_number: null,
    goods_category: null,
    look: 0,
    create_time: null,
    linkman: 1,
    id: null,
    //评论
    talks: [],
    is_you:0,
    yourtalk: '',
    prop: null
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
  * 收藏功能
  */
  addtofvr: function () {
    var goods_id = this.data.id;
    var prop = this.data.prop;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    wx.request({
      url: config.URL + '/easyto/public/index.php/goodsCollect',
      method: "POST",
      data: {
        goods_id: goods_id,
        thr_session: thr_session,
      },
      success: function (res) {
        if (res.data == -1){
          wx.showToast({
            title: '您尚未登陆，无法收藏物品',
            duration: 2000,
            icon: 'none',
            mask: true
          });
          return;
        }
        if (res.data == 1) {
          wx.showToast({
            title: '操作成功',
            duration: 1000,
            mask: true
          });
          that.loaddetail(prop);
        } else {
          wx.showToast({
            title: '操作失败',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        }
      }
    });
  },
  copyphone_number: function (e) {
    wx.setClipboardData({
      data: this.data.phone_number,
      success: function (res) {
        wx.showToast({
          title: '手机号复制成功',
          duration: 1000,
          mask: true
        });
      }
    });
  },
  copywechat_number: function (e) {
    wx.setClipboardData({
      data: this.data.wechat_number,
      success: function (res) {
        wx.showToast({
          title: '微信号复制成功',
          duration: 1000,
          mask: true
        });
      }
    });
  },
  /**
  * 评论功能
  */
  issueTalk: function (e) {
    var talk = e.detail.value.talk;
    if (!talk) {
      wx.showToast({
        title: '请输入评论内容',
        duration: 1000,
        icon: 'none',
        mask: true
      });
      return;
    }
    var goods_id = this.data.id;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    var prop = this.data.prop;
    wx.request({
      url: config.URL + '/easyto/public/index.php/issueTalk',
      method: "POST",
      data: {
        goods_id: goods_id,
        thr_session: thr_session,
        talk: talk
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '评论成功',
            duration: 1000,
            mask: true
          });
          that.loaddetail(prop);
          that.setData({ yourtalk: '', is_you: 1 });
        } else if (res.data == 0){
          wx.showToast({
            title: '您尚未登陆，无法发表评论',
            duration: 2000,
            icon: 'none',
            mask: true
          });
          that.setData({ yourtalk: '' });
        } else {
          wx.showToast({
            title: '请检查，不能输入Emoji表情！',
            duration: 2000,
            icon: 'none',
            mask: true
          });
        }
      }
    });
  },
  loaddetail: function (prop) {
    var goods_id = prop.id;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    wx.request({
      url: config.URL + '/easyto/public/index.php/goodsDetail',
      method: "POST",
      data: {
        goods_id: goods_id,
        thr_session: thr_session
      },
      success: function (res) {
        if(res.data == 0){
          wx.showToast({
            title: '您尚未登陆，请授权登陆',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          return;
        }
        if (res.data.theTalks.length !== 0) {
          var talks = [];
          for (var i = 0; i < res.data.theTalks.length; i++) {
            if (res.data.theTalks[i].talk != null) {
              res.data.theTalks[i].create_time = functions.time(res.data.theTalks[i].create_time);
              
              var h = functions.judge(res.data.theTalks[i].avatar_url);
              if (h !== 'h') {
                res.data.theTalks[i].avatar_url = config.URL + res.data.theTalks[i].avatar_url;
              }
              talks.push(res.data.theTalks[i]);
            }
          }
        }
        var goods_img = [config.URL + res.data.theGoods.goods_img];
        if (res.data.theGoods.goods_img2) {
          goods_img.push(config.URL + res.data.theGoods.goods_img2);
        }
        if (res.data.theGoods.goods_img3) {
          goods_img.push(config.URL + res.data.theGoods.goods_img3);
        }

        res.data.theGoods.goods_category = functions.classify(res.data.theGoods.goods_category);
        if (res.data.is_collect==null){
          res.data.is_collect = '收藏☆';
        } else if (res.data.is_collect.is_collect==0) {
          res.data.is_collect = '收藏☆';
        } else {
          res.data.is_collect = '收藏★';
        }

        var create_time = functions.time(res.data.theGoods.create_time);
        that.setData({
          talks: talks,
          is_collect: res.data.is_collect,
          goods_title: res.data.theGoods.goods_title,
          goods_prom_price: res.data.theGoods.goods_prom_price,
          goods_img: goods_img,
          wechat_number: res.data.theGoods.wechat_number,
          phone_number: res.data.theGoods.phone_number,
          nick_name: res.data.theGoods.nick_name,
          linkman: res.data.theGoods.linkman,
          look: res.data.theGoods.look,
          id: res.data.theGoods.id,
          create_time: create_time,
          goods_category: res.data.theGoods.goods_category,
          goods_abstract: res.data.theGoods.goods_abstract
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (prop) {
    this.setData({ prop: prop });
    this.loaddetail(prop);
    if (!wx.getStorageSync('thr_session')) {
      wx.showModal({
        title: '授权登陆',
        content: '你尚未登陆小程序，该功能不可使用，请前往"个人"进去授权登陆',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../user/user'
            });
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})