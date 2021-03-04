// pages/index/list/list.js
var config = require('../../../utils/config.js');
var functions = require('../../../utils/functions.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    num: -2,
    duoshao:10,
    is_base: 0,
    keyword:null
  },
  /**
   * 自定义函数
   */
  moregoods: function (e) { 
    var that = this;
    var category = that.data.num;
    var duoshao = that.data.duoshao;
    duoshao += 10;
    var goods=[];
    wx.request({
      url: config.URL + '/easyto/public/index.php/goodsCategory',
      method: "POST",
      data: {
        category: category,
        num:duoshao
      },
      success:function(res){
        if (res.data == null) {
          wx.showToast({
            title: '已经到底了',
            duration: 1000,
            icon: 'none'
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
        that.setData({ duoshao: duoshao });
        that.setData({ goods: goods });
        setTimeout(() => { wx.hideLoading() }, 1000);
      }
    });
  },
  /**
   * 自定义函数
   */
  findgoods: function (e) {
    var that = this;
    if (e == -1) {
      var category = e;
      that.setData({
        num: e,
        duoshao:10
      });
    } else if (e == -2) {
      var category = that.data.num;
    } else {
      var category = e.target.dataset.value;
      that.setData({
        num: e.target.dataset.num,
        duoshao: 10,
        is_base:0
      });
    }
    var goods = [];
    var duoshao = that.data.duoshao;
    wx.request({
      url: config.URL + '/easyto/public/index.php/goodsCategory',
      method: "POST",
      data: {
        category: category,
        num: duoshao
      },
      success: function (res) {
        if (res.data == null) {
          wx.showToast({
            title: '用户尚未发布该类物品',
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
  /**
 * 搜索功能
 */
  goodsSearch: function (e) {
    var that = this;
    var goods =[];
    if (e.title) {
      var title = e.title;
      that.setData({ keyword:title});
    } 
    if (typeof (e.detail) != 'undefined') {
      var title = functions.trim(e.detail.value.title);
      that.setData({ keyword: title });
    }
    if (!title) {
      wx.showToast({
        title: '请输入搜索内容',
        duration:1000,
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.request({
      url: config.URL + '/easyto/public/index.php/goodsSearch',
      method: "POST",
      data: {
        title: title
      },
      success: function (res) {
        that.setData({
          num: -2
        });
        if (res.data.length != 0) {
          wx.showToast({
            title: '查找成功',
            duration: 1000,
            mask: true
          });
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].create_time = functions.time(res.data[i].create_time);

            var h = functions.judge(res.data[i].avatar_url);
            if (h !== 'h') {
              res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
            }

            res.data[i].goods_category = functions.classify(res.data[i].goods_category);

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
          else {
            wx.showToast({
              title: '没有找到相似物品，请重新输入关键词',
              duration:2000,
              icon: 'none',
              mask: true
            });
          that.setData({ goods: [] });
          }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (prop) {
    var that = this;
    if (prop.category) {
      var category = prop.category;
      that.setData({
        num: Number(category),
        duoshao:10,
        is_base: 0
      });
      this.findgoods(-2);
    }
    if (prop.title) {
      setTimeout(() => { that.goodsSearch(prop) }, 800);
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
    this.moregoods();
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
    wx.showLoading({
      title: '更新中',
      duration: 1000,
      mask: true
    });
    this.setData({ duoshao:10,is_base:0})
    this.findgoods(-1);
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.is_base == 1) {
      wx.showToast({
        title: '已经到底了',
        duration: 1000,
        icon: 'none'
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
});