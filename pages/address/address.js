// pages/address/address.js
const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addList: [],
    prevPage:''
  },
  delAddr:function(e){//删除地址
    var self = this;  
    var app = getApp();
    var delId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除地址？',
      success: function (res) {
        if (res.confirm) {
          //请求删除收货地址
          wx.request({
            url: app.globalData.service + '/api/deliveryAddress/del',
            method: 'POST',
            data: {
              userToken: app.globalData.userToken,
              id:delId
            },
            success: function (res) {
              console.log(res);
              var data = res.data;
              if (data.code == 0) {
                //
                //成功后提示
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 800,
                  mask: true
                })    
                self.onLoad();
              }
              else {
                alert(res.data.msg);
              }
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  selectAddr:function(e){//选择地址
    if (this.data.prevPage =='order'){
      wx.redirectTo({
        url: '../confirmOrder/confirmOrder?prev=addr'
      });
    } else if(this.data.prevPage == 'gift'){
      wx.redirectTo({
        url: '../giftConfirm/giftConfirm?prev=addr'
      });
    }

    var _value = {
      receiverName: e.currentTarget.dataset.name,
      receiverPhone: e.currentTarget.dataset.phone,
      receiverAddress: e.currentTarget.dataset.addr
    }
    wx.setStorageSync('addrInfo', _value)
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log('收货地址页面开始加载...');    
    if (options != null){
      var action = options.prev;
      //console.log('action=>' + action);
      if (action != null) {
        this.setData({
          prevPage: action
        });
      }
    }
   
    var self = this;
    var app = getApp();
    //请求收货地址列表数据
    wx.request({
      url: app.globalData.service + '/api/deliveryAddress/list',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置收货地址列表数据
          //self.data.indexImg = data.result;
          if(data.result)
          {
            
            self.setData({
              addList: data.result,
              addrNum: data.result.length
            });
          } else {
            self.setData({
              addList: [],
              addrNum:0
            });
          }          
        }
        else {
          alert(res.data.msg);
        }
      }
    })

    util.checkUserInfoAuth();
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
    duration: 1000,
    mask: true
  })
}