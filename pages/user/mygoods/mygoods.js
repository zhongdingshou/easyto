// pages/user/mygoods/mygoods.js
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
    phone_number: null,
    wechat_number: null,
    goods_category: null,
    look: 0,
    is_buy:0,
    create_time: null,
    linkman: 1,
    id: null,
    //评论
    talks: [],
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
 * 删除物品
*/
  deletegoods: function (e) {
    var goods_id = e.target.dataset.goods_id;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    wx.showModal({
      title: '删除物品',
      content: '是否删除你的物品？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: config.URL + '/easyto/public/index.php/goodsDelete',
            method: "POST",
            data: {
              goods_id: goods_id,
              thr_session: thr_session
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '删除成功',
                  duration: 1000,
                  icon: 'success',
                  mask: true
                });
                  wx.switchTab({
                    url: '../user',
                  });
              } else if (res.data == 0) {
                wx.showToast({
                  title: '删除失败',
                  duration: 1000,
                  icon: 'none',
                  mask: true
                });
              }
            }
          });
        }
      }
    });
  },
  /**
* 已卖出物品
*/
  buygoods: function (e) {
    var goods_id = e.target.dataset.goods_id;
    var thr_session = wx.getStorageSync('thr_session');
    var that = this;
    wx.showModal({
      title: '提示',
      content: '该物品已经被购买吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: config.URL + '/easyto/public/index.php/goodsBuy',
            method: "POST",
            data: {
              goods_id: goods_id,
              thr_session: thr_session
            },
            success: function (res) {
              if (res.data == 1) {
                wx.showToast({
                  title: '恭喜你卖出一件物品',
                  duration: 2000,
                  mask: true
                });
                wx.switchTab({
                  url: '../user',
                });
              } else if (res.data == 2) {
                wx.showToast({
                  title: '该物品暂未通过审核，不可能卖出的',
                  duration: 2000,
                  icon: 'none',
                  mask: true
                });
              } else if (res.data == 0) {
                wx.showToast({
                  title: '查找失败',
                  duration: 1000,
                  icon: 'none',
                  mask: true
                });
              }
            }
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
          is_buy: res.data.theGoods.is_buy,
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