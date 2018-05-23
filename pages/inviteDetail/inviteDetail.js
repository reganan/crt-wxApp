// pages/inviteDetail/inviteDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteDetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var app = getApp();
    
    wx.request({
      url: app.globalData.service + '/api/invite/detail',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          if (data.result) {
            self.setData({
              inviteDetail: data.result
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
    this.onLoad()
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