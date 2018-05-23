// pages/choiceType/choiceType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // proType:[{
    //   "id": "10001",
    //   "amount": "111",
    //   "repayContent": "回报内容",
    //   "repayTime": "2018-09-09",
    //   "count": "2000"
    // }, {
    //   "id": "10002",
    //   "amount": "0",
    //   "repayContent": "回报内容",
    //   "repayTime": "2018-09-09",
    //   "count": "1000"
    // }],
    // _amount:'',
    // productId:'',
    // payTypeId:''
  },
  choiceType:function(e){    
    this.setData({
      _payTypeId: e.currentTarget.dataset.type,
      productId: e.currentTarget.dataset.id,
      payTypeId: e.currentTarget.dataset.type
    })
  },
  toConfirmOrder: function (e) {
    var app = getApp();
    if (!!this.data.productId && !!this.data.payTypeId){
      app.globalData.confirmOrder_page = 0;
      wx.navigateTo({
        url: "../confirmOrder/confirmOrder?id=" + this.data.productId + "&&payTypeId=" + this.data.payTypeId
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      _payTypeId: options.type      
    });    
    var id = options.id;
    //console.log('id=>' + id);
    var self = this;
    var app = getApp();
    wx.request({
      url: app.globalData.service + '/api/product/payType',
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {          
          if (data.result) {
            self.setData({
              proType: data.result,
              productId: id,
              payTypeId: data.result[0].payTypeId
            });
            //console.log(this.data);
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