// pages/orderDetail/orderDetail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.servicePhone,
      success: function () {
        //console.log("拨打电话成功！")
      },
      fail: function () {
        //console.log("拨打电话失败！")
      }
    })
  },
  toContract:function(){
    if (!!this.data.orderDetail.orderNo){
      wx.navigateTo({
        url: "../contract/contract?orderNo=" + this.data.orderDetail.orderNo
      })
    }
  },
  replyRefund:function(){
    wx.showModal({
      title: '提示',
      content: '确定申请退款吗？',
      success: function (res) {
        if (res.confirm) {
          var pages = getCurrentPages()    //获取加载的页面
          var currentPage = pages[pages.length - 1] 
          //console.log('用户点击确定')          
          if (!!currentPage.data.orderDetail.orderNo) {
            wx.request({
              url: app.globalData.service + '/api/order/updateOrderStatus',
              method: 'POST',
              data: {
                orderNo: currentPage.data.orderNo,
                status: '2',
                userToken: app.globalData.userToken
              },
              success: function (res) {
                console.log(res);
                var data = res.data;
                if (data.code == 0) {
                  //设置产品数据
                  if (data.result) {
                    var _orderDetail = currentPage.data.orderDetail;
                    currentPage.setData({
                      _orderDetail: data.result
                    });
                  }
                }

                wx.showToast({
                  title: '申请退款成功',
                  icon: 'none',
                  duration: 1000
                })

                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/order/order'
                  })
                },1000)
              }
            })            
          }
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var self = this;
    self.setData({
      servicePhone: app.globalData.servicePhone,
      orderNo: options.orderNo
    })

    wx.request({
      url: app.globalData.service + '/api/order/detail',
      method: 'POST',
      data: {
        orderNo: options.orderNo
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置产品数据
          //self.data.indexImg = data.result;
          if (data.result) {
            self.setData({
              orderDetail: data.result
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