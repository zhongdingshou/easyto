// pages/user/approve/approve.js
var config = require('../../../utils/config.js');
var functions = require('../../../utils/functions.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    student_id:null,
    compellation:null
  },
  /**
   * 自定义函数
   */
  send:function(){
    wx.navigateTo({
      url: '../about/about',
    });
  },
  approveFormSubmit:function (e){
    var that = this;
    var thr_session = wx.getStorageSync('thr_session');
    var student_id = e.detail.value.student_id;
    var compellation = functions.trim(e.detail.value.compellation);
    if (student_id && compellation) {
      if (!(/(^[1-9]\d*$)/.test(student_id))) {
        wx.showToast({
          title: '学号为正整数',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
      if (!(/(^\d{11}$)/.test(student_id))) {
        wx.showToast({
          title: '学号为11位数',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
      wx.request({
        url: config.URL + '/easyto/public/index.php/approve',
        method: 'POST',
        data: {
          student_id: student_id,
          compellation: compellation,
          thr_session: thr_session
        },
        success: function (res) {
          if (res.data == 1) {
            wx.showToast({
              title: '认证成功',
              duration: 1000,
              mask: true
            });
          } else if (res.data == -1) {
            wx.showToast({
              title: '认证失败，该用户已认证',
              duration: 1000,
              icon: 'none',
              mask: true
            });
          } else if (res.data == 2) {
            wx.showToast({
              title: '你已认证，认证信息更新成功',
              duration: 1000,
              icon: 'none',
              mask: true
            });
          } else if (res.data == 0) {
            wx.showToast({
              title: '认证失败',
              duration: 1000,
              icon: 'none',
              mask: true
            });
          } else {
            wx.setStorageSync('thr_session', res.data);
            wx.showToast({
              title: '认证成功',
              duration: 1000,
              mask: true
            });
          }
        }
      });
    } else {
      wx.showToast({
        title: '请把认证信息填完整',
        duration: 1000,
        icon: 'none',
        mask: true
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var student_id = options.student_id;
    var thr_session = wx.getStorageSync('thr_session');
    if (student_id){
      wx.request({
        url: config.URL + '/easyto/public/index.php/getApprove',
        method: 'POST',
        data: {
          student_id: student_id,
          thr_session: thr_session
        },
        success: function (res) {
          if(res.data){
            that.setData({
              compellation: res.data.compellation,
              student_id: res.data.student_id
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