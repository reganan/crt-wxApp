// pages/order/order.js
const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[]
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var self = this;
    var app = getApp();
    //请求banner和简介数据
    wx.request({
      url: app.globalData.service + '/api/order/list',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置banner和简介数据
          //self.data.indexImg = data.result;
          if(data.result)
          {
            self.setData({
              orderList: data.result
            });
          }          
        }
      }
    })

    util.checkUserInfoAuth();
  },
  closeBomb: function () {//协议弹框关闭按钮
    var self = this;
    self.setData({
      showBombStatus: false
    });
    setTimeout(
      function () {
        self.setData({
          showBombStatus: true
        });
      }, 100
    )
  },
  agreeBomb: function () {//协议弹框确定按钮
    var app = getApp();

    this.setData({
      showBombStatus: false
    });

    //请求更新已承诺
    wx.request({
      url: app.globalData.service + '/api/personal/updatePromise',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken,
        userInfo: app.globalData.userInfo
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          app.globalData.isPromise = 1;
        }
      }
    })
  },
  toGotUserInfo: function (e) {
    var self = this;
    console.log(e.detail)
    if (e.detail.userInfo) {//用户按了允许授权按钮      
      self.setData({
        showAuthorizeStatus: false
      });
      app.globalData.userInfo = e.detail.userInfo;

      var inviteCode = '';
      try {
        var inviteCode = self.data.inviteCode
      } catch (e) {
        console.log(e);
      }    
      util.userLogin(inviteCode);

      setTimeout(
        function(){
          self.onLoad();
        }
      ,500)

    } else {//用户按了拒绝按钮      
      self.setData({
        showAuthorizeStatus: true
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
    this.onLoad();

    if (app.globalData.userInfo) {
      this.setData({
        showAuthorizeStatus: false
      });
    }
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