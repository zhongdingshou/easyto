// pages/publish/publish.js
const app = getApp();
var config = require('../../utils/config.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    userInfo:'',
    imgs:[],
    starTap:0,
    endTap:0,
    current:0,
    isNew:false,
    pubType:['其他','电子','书籍','体育','生活'],
    pubTypeEq:0,
    price:0,
    you_goods:'',
  },

  /*自定义函数*/
  /*
    获取按下图片的时间
  */
  bindStarTap: function (e) {
    this.setData({
      starTap: e.timeStamp
    });
  },
  /*
    获取放开触摸的时间
  */
  bindEndTap: function (e) {
    this.setData({
      endTap: e.timeStamp,
      current: e.currentTarget.id
    });
    if (this.data.endTap - this.data.starTap >= 400)//大于400毫秒，去除图片
    {
      var file = this.data.imgs;
      var i;
      for (i = 0; i < this.data.imgs.length; i++) {
        if (this.data.imgs[i] == this.data.current) { break; }
      }
      file.splice(i, 1);//索引到第i+1个，删除它     
      this.setData({
        imgs: file
      })
      if (this.data.imgs.length > 3) {
        this.setData({
          wordsColor_inpicture: "#F43530",//过度上传图片，字体变红
        });
      } else {
        this.setData({
          wordsColor_inpicture: "#BFBFBF",//字体颜色回复     
        });
      }
    }
    else//否则点击预览图片
    {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.imgs // 需要预览的图片http链接列表
      });
    }
  },
  /*
    图片选择
  */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgs: that.data.imgs.concat(res.tempFilePaths)
        });
        if (that.data.imgs.length > 3) {
          that.setData({
            wordsColor_inpicture: "#F43530",//过度上传图片，字体变红                 
          });
        }
        else {
          wordsColor_inpicture: "#BFBFBF"
        }
      }
    });
  },
  
  /*
    选择类型
  */
  changeType:function(e){
    this.setData({
      pubTypeEq: e.detail.value
    });
  },
  /*
    价格
  */
  changPrice: function(e){
    this.setData({
      price: e.detail.value
    });
  },
  /*
    发布物品
  */
  submitForm: function(res){
    var thr_session = wx.getStorageSync('thr_session');
    wx.request({
      url: config.URL + '/easyto/public/index.php/getUser',
      method: "POST",
      data: {
        thr_session: thr_session
      },
      success: function (res) {
        if (res.data == 0) {
          return;
        }
        if (!res.data.wechat_number || !res.data.phone_number || !res.data.linkman) {
          wx.showModal({
            title: '联系方式未填写',
            content: '你尚未填写联系方式，该功能不可使用，请前往"个人编辑页"进行填写',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../user/edit/edit',
                });
              }
            }
          });
        }
      }
    });
    var pictures = [];
    var that = this;
    var tempFilePaths = that.data.imgs;
    var goods_title = res.detail.value.goods_title;
    var goods_abstract = res.detail.value.goods_abstract;
    var goods_category = res.detail.value.goods_category;
    var goods_prom_price = res.detail.value.goods_prom_price;
    if (goods_title && goods_abstract && goods_prom_price) {
      if (tempFilePaths.length > 3) {
        wx.showToast({
          title: '物品图片不能超过3张',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      } 
      if (tempFilePaths.length < 1) {
        wx.showToast({
          title: '请上传至少一张物品图片',
          duration: 1000,
          icon: 'none',
          mask: true
        });
        return;
      }
        function isNumber(val) {
          var regPos = /^\d+(\.\d+)?$/; //非负浮点数
          var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
          if (regPos.test(val) || regNeg.test(val)) {
            return true;
          } else {
            return false;
          }
        }
        if (!isNumber(goods_prom_price)){
          wx.showToast({
            title: '价格请输入数字',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          return;
        } else if(goods_prom_price<0){
          wx.showToast({
            title: '价格不能小于0',
            duration: 1000,
            icon: 'none',
            mask: true
          });
          return;
        }
      var num=0;
      for (var i = 0; i < tempFilePaths.length; i++) {
        wx.uploadFile({
          url: config.URL + '/easyto/public/index.php/goodsImagesUplaod', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[i],
          name: 'image',
          success: function (res) {
            num++;
            var data = JSON.parse(res.data);
            if (data.status==1){
              pictures.push(data.addr);

            }
            if (num === tempFilePaths.length) {
              var thr_session = wx.getStorageSync('thr_session');
                wx.request({
                  url: config.URL + '/easyto/public/index.php/issueGoods',
                  method: 'POST',
                  data: {
                    num: num,
                    pictures: pictures,
                    goods_title: goods_title,
                    goods_abstract: goods_abstract,
                    goods_category: goods_category,
                    goods_prom_price: goods_prom_price,
                    thr_session: thr_session
                  },
                  success: function (result) {
                    if (result.data==1) {
                      wx.showToast({
                        title: '发布成功，物品审核中',
                        duration: 1000,
                        icon: 'none',
                        mask: true
                      });
                      that.setData({ you_goods: '', price: '',imgs:[] });
                    } else if (result.data == -1) {
                      wx.showModal({
                        title: '联系方式未填写',
                        content: '你尚未填写联系方式，该功能不可使用，请前往"个人编辑页"进行填写',
                        success: function (res) {
                          if (res.confirm) {
                            wx.navigateTo({
                              url: '../user/edit/edit',
                            });
                          }
                        }
                      });
                    } else {
                      wx.showToast({
                        title: '发布失败，请检查，不能输入Emoji表情！',
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
      }
    } else {
      wx.showToast({
        title: '请把物品信息填完整',
        duration: 1000,
        icon: 'none',
        mask: true
      });
    }
  },
  /*↑自定义函数↑*/

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var _this = this;
    if (app.globalData.userInfo) {
      _this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      });
    } else {
      if (!wx.getStorageSync('thr_session')) {
        wx.showModal({
          title: '授权登陆',
          content: '你尚未登陆小程序，该功能不可使用，请前往"个人"进去授权登陆',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../user/user'
              });
            }
          }
        });
      }
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