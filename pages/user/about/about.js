// pages/user/about/about.js
var config = require('../../../utils/config.js');
var functions = require('../../../utils/functions.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:[],
    youadvice:''
  },
  //自定义函数
  issueadvice:function(e){
    var that = this;
    
    var youadvice = functions.trim(e.detail.value.youadvice);
    var thr_session = wx.getStorageSync('thr_session');
    if (!youadvice) {
      wx.showToast({
        title: '请输入反馈内容',
        duration: 1000,
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: config.URL + '/easyto/public/index.php/satAdvice',
      method: "POST",
      data: {
        advice: youadvice,
        thr_session: thr_session,
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '发表成功',
            duration: 1000,
            mask: true
          });
        } else if(res.data == 0) {
          wx.showToast({
            title: '发表失败',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        } else {
          wx.showToast({
            title: '请检查，不能输入Emoji表情！',
            duration: 1000,
            icon: 'none',
            mask: true
          });
        }
        that.setData({ youadvice: '' });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var msg = [];
    wx.request({
      url: config.URL + '/easyto/public/index.php/getAbout',
      success:function(res){
        if (res.data.length !== 0) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].create_time = functions.time(res.data[i].create_time);
            msg.push(res.data[i]);
          }
          that.setData({ msg: res.data });
        }
      }
    });
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