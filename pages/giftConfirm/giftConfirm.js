// pages/giftConfirm/giftConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // "userToken": "w2erwerwef232323",
    // "prizeImg": "http://163.com/sdf.jpg",
    // "prizeName": "价值45元的鸡蛋",
    // "defAddress":{
    //   "receiverName": "收货人",
    //   "receiverPhone": "收货人手机号码",
    //   "receiverAddress": "收货人地址"
    // }
  },
  toGiftAddr:function(){
    if (!!getApp().globalData.userToken) {
      wx.navigateTo({
        url: "../address/address?prev=gift"
      })
    }
  },
  getGift:function(){
    var self = this;
    var app = getApp();
    var _data = self.data;
    _data.userToken = app.globalData.userToken;

    if (!!self.data.defAddress){

      wx.showLoading({
        title: '提交支付中',
      })

      wx.request({
        url: app.globalData.service + '/api/invite/createOrder',
        method: 'POST',
        data: _data,
        success: function (res) {
          console.log(res);
          var data = res.data;
          if (data.code == 0) {
            wx.switchTab({
              url: '/pages/order/order'
            })
          }
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }else{
      alert('请先配置收货人信息！');
      self.setData({        
        addrErr: 'errmsg'
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    var self = this;
    var app = getApp();   

    wx.request({
      url: app.globalData.service + '/api/invite/config',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {
          if (data.result) {
            if (options.prev == 'addr') {              
              var receiverAddr = wx.getStorageSync('addrInfo');              
              self.setData({
                defAddress: receiverAddr
              });
            }else{
              self.setData({
                defAddress: data.result.defAddress
              });
            }

            self.setData({              
              prizeAmount: data.result.prizeAmount,
              prizeImg: data.result.prizeImg,
              prizeName: data.result.prizeName
            });

          }
        }
      }
    })

   
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
  // onShareAppMessage: function () {
  
  // }
})
function alert(content) {
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 2000,
    mask: true
  })
}