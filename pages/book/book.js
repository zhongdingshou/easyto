// pages/book/book.js
var config = require('../../utils/config.js');
var functions = require('../../utils/functions.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    tabVal: 0,
    allSay: [],
    mySay: [],
    nowsay:'',
    num:10
  },

  // 获取我的说说
  getMySay:function(){
    var that = this;
    var mySay = [];
    var thr_session = wx.getStorageSync('thr_session');
    wx.request({
      url: config.URL + '/easyto/public/index.php/getMySay',
      method: "POST",
      data: {
        thr_session: thr_session
      },
      success: function (res) {
        if (res.data.length !== 0) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].create_time = functions.time(res.data[i].create_time);
            var h = functions.judge(res.data[i].avatar_url);
            if (h !== 'h') {
              res.data[i].avatar_url = config.URL + res.data[i].avatar_url;
            }
            mySay.push(res.data[i]);
          }
        }
        that.setData({ mySay: mySay });
      }
    })
  },

  /*
    tab切换
  */
  tab: function (i) {
    var val = i.target.dataset.val - 0;
    this.setData({
      tabVal: val
    });
    if (i.target.dataset.val == 1) {
      this.getMySay();
    }
  },
  /*
    删除
  */
  deletesay: function(e){
    var say_id = e.target.dataset.say_id;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    wx.showModal({
      title: '是否删除这条说说？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: config.URL + '/easyto/public/index.php/deleteSay',
            method: "POST",
            data: {
              say_id: say_id,
              thr_session: thr_session
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '已删除',
                  mask: true
                });
              } else {
                wx.showToast({
                  title: '删除失败',
                  duration:1000,
                  icon: 'none',
                  mask: true
                });
              }
              that.newsay();
              that.getMySay();
            }
          })
        }
      }
    })
  },
  /*
    点赞
  */
  praise: function(e){
    var thr_session = wx.getStorageSync('thr_session');
    var say_id = e.target.dataset.say_id;
    var that = this;
    wx.request({
      url: config.URL + '/easyto/public/index.php/setPraise',
      method: "POST",
      data: {
        say_id: say_id,
        thr_session: thr_session,
      },
      success: function (res) {
        if (res.data==1) {
          wx.showToast({
            title: '已点赞',
            duration: 1000,
            mask: true
          });
        } else if (res.data == -1) {
          wx.showToast({
            title: '已取消点赞',
            duration: 1000,
            mask: true
          });
        } else if (res.data == 2) {
          wx.showToast({
            title: '您尚未登陆，无法点赞',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: '操作失败',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        }
        that.newsay();
        that.getMySay();
      }
    });
  },
  /*
    点踩
  */
  tread: function(e){
    var thr_session = wx.getStorageSync('thr_session');
    var say_id = e.target.dataset.say_id;
    var that = this;
    wx.request({
      url: config.URL + '/easyto/public/index.php/setTread',
      method: "POST",
      data: {
        say_id: say_id,
        thr_session: thr_session,
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '已点踩',
            duration: 1000,
            mask: true
          });
        } else if (res.data == 2) {
          wx.showToast({
            title: '您尚未登陆，无法点踩',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        }  else if (res.data == -1) {
          wx.showToast({
            title: '已取消点踩',
            duration: 1000,
            mask: true
          });
        } else {
          wx.showToast({
            title: '操作失败',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        }
        that.newsay();
        that.getMySay();
      }
    });
  },
  //更多说说
  moresay: function () {
    var that = this;
    var allSay = [];
    var num = that.data.num;
    num += 10;
    wx.request({
      url: config.URL + '/easyto/public/index.php/getSay',
      method: 'POST',
      data: { num: num },
      success: function (res) {
        if (res.data == null) {
          wx.showToast({
            title: '已经到底了',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          that.setData({ num: 0 });
          return;
        }
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].create_time = functions.time(res.data[i].create_time);
          allSay.push(res.data[i]);
        }
        that.setData({ num: num });
        that.setData({ allSay: allSay });
        setTimeout(() => { wx.hideLoading() }, 1000);
      }
    })
  },
  //刷新页面
  newsay:function(){
    var that = this;
    var allSay = [];
    var num = this.data.num;
    wx.request({
      url: config.URL + '/easyto/public/index.php/getSay',
      data:{num:num},
      method:'POST',
      success: function (res) {
        if (res.data == null) {
          wx.showToast({
            title: '用户尚未发布说说',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          return;
        }
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].create_time = functions.time(res.data[i].create_time);
          allSay.push(res.data[i]);
        }
        that.setData({ allSay: allSay });
      }
    })
  },

  //发表说说
  issueSay:function(e){
    var that = this;
    var say = functions.trim(e.detail.value.nowsay);
    var thr_session = wx.getStorageSync('thr_session');
    if (!say) {
      wx.showToast({
        title: '请输入说说内容',
        duration: 1000,
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.request({
      url: config.URL + '/easyto/public/index.php/satSay',
      method: "POST",
      data: {
        say: say,
        thr_session: thr_session,
      },
      success: function (res) {
        if (res.data == 0){
          wx.showToast({
            title: '您尚未认证，无法发表说说，请前往个人页进行认证',
            duration: 2000,
            icon: 'none',
            mask: true
          });
        } else if (res.data == 1) {
          wx.showToast({
            title: '发表成功',
            duration: 1000,
            mask: true
          });
        } else if (res.data == -1){
          wx.showToast({
            title: '您尚未登陆，无法发表说说',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: '请检查，不能输入Emoji表情！',
            duration: 2000,
            icon: 'none',
            mask: true
          });
        }
        that.newsay();
        that.setData({ nowsay:''});
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.newsay();
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
    this.setData({ num: 10 });
    this.newsay();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.tabVal==1){
      return;
    }
    if (this.data.num == 0) {
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
    this.moresay();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
});