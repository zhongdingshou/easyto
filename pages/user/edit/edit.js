// pages/user/edit/edit.js
var config = require('../../../utils/config.js');
var functions = require('../../../utils/functions.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    linkman:'',
    wechat_number:'',
    phone_number:'',
    is_approve:'',
    student_id: null
  },

  /*自定义函数*/
  /*
    认证
  */
  approve: function(){
    var student_id = this.data.student_id;
    if (student_id == null ){
      wx.navigateTo({
        url: '../approve/approve',
      });
    } else {
      wx.showModal({
        title: '你已认证',
        content: '是否重新认证？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../approve/approve?student_id=' + student_id,
            });
          }
        }
      });
    }
  },
  /*
    确定编辑
  */
  editFormSubmit: function(e){
    var that = this;
    var thr_session = wx.getStorageSync('thr_session');
    var linkman = functions.trim(e.detail.value.linkman);
    var phone_number = functions.trim(e.detail.value.phone_number);
    var wechat_number = functions.trim(e.detail.value.wechat_number);
    if (linkman && phone_number && wechat_number) {
      if (!/^[\u4E00-\u9FA5]+$/.test(linkman)) {
        wx.showToast({
          title: '联系人请输入纯汉字',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
      if (!(/^[0-9a-zA-Z]*$/g.test(wechat_number))) {
        wx.showToast({
          title: '微信号格式错误，请输入正确微信号',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
      if (!(/(^[1-9]\d*$)/.test(phone_number))) {
        wx.showToast({
          title: '手机号为正整数',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
      if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone_number))) {
        wx.showToast({
          title: '手机号码格式错误，请输入正确手机号',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      } 
      wx.request({
        url: config.URL + '/easyto/public/index.php/editUserInfo',
        method:'POST',
        data:{
          linkman: linkman,
          phone_number: phone_number,
          wechat_number: wechat_number,
          thr_session: thr_session
        },
        success:function(res) {
          if(res.data==1){
            wx.showToast({
              title: '修改成功',
              duration: 1000,
              mask: true
            });
            that.loadinfo();
          } else {
            wx.showToast({
              title: '请输入修改信息',
              duration: 1000,
              icon: 'none',
              mask: true
            });
          }
        }
      });
    } else {
      wx.showToast({
        title: '请把信息填完整',
        duration: 1000,
        icon: 'none',
        mask: true        
      });
    }
  },
  loadinfo:function(){
    var that = this;
    var thr_session = wx.getStorageSync('thr_session');
    wx.request({
      url: config.URL + '/easyto/public/index.php/getUser',
      method: 'POST',
      data: {
        thr_session: thr_session
      },
      success: function (res) {
        if (res.data == 0) {
          return;
        }
        switch (res.data.is_approve){
          case 0: res.data.is_approve='未认证';break;
          case 1: res.data.is_approve = '已认证';
        }
        that.setData({
          linkman: res.data.linkman,
          wechat_number: res.data.wechat_number,
          phone_number: res.data.phone_number,
          is_approve: res.data.is_approve,
          student_id: res.data.student_id
        });
      }
    });
  },
  /*↑ 自定义函数 ↑*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.userInfo && app.globalData.userInfo != ''){
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
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
    this.loadinfo();
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