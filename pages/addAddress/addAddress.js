// pages/addAddress/addAddress.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {    
    isDef: 0
  },

  receiverName_input: function(e){
    this.setData({
      receiverName: e.detail.value
    })
    //alert(e.detail.value);
  },
  receiverPhone_input: function (e) {
    this.setData({
      receiverPhone: e.detail.value
    })
    //alert(e.detail.value);
  },
  receiverAddress_input: function (e) {
    this.setData({
      receiverAddress: e.detail.value
    })
    //alert(e.detail.value);
  },
  postCode_input: function (e) {
    this.setData({
      postCode: e.detail.value
    })
    //alert(e.detail.value);
  },
  isDef_input: function (e) {
    
    if(e.detail.value.length>0)
    {
      //console.log('checkbox发生change事件，携带value值为1：', e.detail.value)
      this.setData({
        isDef: 1
      })
    }else
    {
      //console.log('checkbox发生change事件，携带value值为2：', null)
      this.setData({
        isDef: 0
      })
    }
  },
  add:function()
  {
    var self = this;
    var app = getApp();

    var action = '';
    var prevPage = this.data.prevPage;
    if (prevPage != null) {
      action = '?prev=' + prevPage;
    }

    var receiverName = self.data.receiverName;
    var receiverPhone = self.data.receiverPhone;
    var receiverAddress = self.data.receiverAddress;

    if(util.isEmpty(receiverName,'收货人')){
      if (util.validatemobile(receiverPhone)){
        if (util.isEmpty(receiverAddress, '详细地址')){
          var validateResult = true;
        }
      }
    }
    
    if (validateResult){
      if (this.data.id == null || this.data.id=='')
      {
        //alert('1111111111111111111111111111');
        //请求添加收货地址数据
        wx.request({
          url: app.globalData.service + '/api/deliveryAddress/add',
          method: 'POST',
          data: {
            userToken: app.globalData.userToken,
            id: self.data.id,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            receiverAddress: receiverAddress,
            postCode: self.data.postCode,
            isDef: self.data.isDef
          },
          success: function (res) {
            //console.log(res);
            var data = res.data;
            if (data.code == 0) {              
              self.addrEditSuccess(prevPage, receiverName, receiverPhone, receiverAddress);    
            }
            else {
              alert(res.data.msg);
            }
          }
        })
      }
      else
      {
        //alert('222222222222222222222222222222');
        //请求添加收货地址数据
        wx.request({
          url: app.globalData.service + '/api/deliveryAddress/update',
          method: 'POST',
          data: {
            userToken: app.globalData.userToken,
            id: self.data.id,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            receiverAddress: receiverAddress,
            postCode: self.data.postCode,
            isDef: self.data.isDef
          },
          success: function (res) {
            //console.log(res);
            var data = res.data;
            if (data.code == 0) {
              self.addrEditSuccess(prevPage, receiverName, receiverPhone, receiverAddress);
            }
            else
            {
              wx.showToast({
                title: '操作失败',
                icon: 'none',
                duration: 1000,
                mask: true
              })
            }
          }
        })
      }

    }
  },
  addrEditSuccess: function (prevPage, receiverName, receiverPhone, receiverAddress){
    //成功后跳转到收货地址页面,下单过程中新增或编辑地址返回下单页
    var _value = {
      receiverName: receiverName,
      receiverPhone: receiverPhone,
      receiverAddress: receiverAddress
    }

    if (prevPage == 'order') {
      wx.redirectTo({
        url: '../confirmOrder/confirmOrder?prev=addr'
      });
      wx.setStorageSync('addrInfo', _value)
    } else if (prevPage == 'gift') {
      wx.redirectTo({
        url: '../giftConfirm/giftConfirm?prev=addr'
      });
      wx.setStorageSync('addrInfo', _value)
    } else {
      wx.redirectTo({
        url: "../address/address" + action,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var action = options.prev;
    
    if (action != null) {
      this.setData({
        prevPage: action
      });
    }

    if (options.addrNum == 0) {//当前无地址时增加地址默认选中默认地址
      this.setData({
        isDef: 1
      });
    }

    //编辑地址  获取原地址  
    if (!!options.id){
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      var id = options.id;
      var self = this;
      var app = getApp();
      //请求收货地址列表数据
      wx.request({
        url: app.globalData.service + '/api/deliveryAddress/query',
        method: 'POST',
        data: {
          userToken: app.globalData.userToken,
          id:id
        },
        success: function (res) {
          //console.log(res);
          var data = res.data;
          if (data.code == 0) {
            //设置收货地址列表数据
            //self.data.indexImg = data.result;
            if (data.result) {
              self.setData({
                id: data.result.id,
                receiverName: data.result.receiverName,
                receiverPhone: data.result.receiverPhone,
                receiverAddress: data.result.receiverAddress,
                postCode: data.result.postCode,
                isDef: data.result.isDef
              });
            }
          }
          else {
            alert(res.data.msg);
          }
        }
      })      
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

