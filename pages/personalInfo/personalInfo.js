// pages/personalInfo/personalInfo.js
const util = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
       "verifycode_name":"获取验证码",            
       "filled": false,
       "modalhidden":true
      // "buttonDisable": false,
      // "realName": "真实姓名",
      // "mobilePhone": "400-5858-0000",
      // "idCard": "23423423423",
      // "bankName": "中国银行",
      // "bankInfo": "上海支行",
      // "bankCard": "2234234234234",
      // "prevPage": ''
  },
  confirmUserInfo:function(){
    var self = this;
    var realName = self.data.realName;
    var mobilePhone = self.data.mobilePhone;
    var verifyCode = self.data.verifyCode;
    var idCard = self.data.idCard;
    var bankName = self.data.bankName;
    var bankInfo = self.data.bankInfo;
    var bankCard = self.data.bankCard;
    
    if (util.isEmpty(realName, '姓名')) {
      if (util.validatemobile(mobilePhone)) {
        if (util.isEmpty(verifyCode, '验证码')) {
          if (util.isEmpty(idCard, '身份证号')){
            if (util.isEmpty(bankName, '银行')) {
              if (util.isEmpty(bankInfo, '开户行')) {
                if (util.isEmpty(bankCard, '银行卡号')) {                  
                  self.setData({
                    modalhidden:false
                  })

                }
              }
            }
          }          
        }
      }
    }
  },
  modalcancel:function(){
    this.setData({
      modalhidden: true
    })

  },
  modalconfirm:function(){
    var self = this;
    self.saveUserInfo();
    self.setData({
      modalhidden: true
    })
  },
  saveUserInfo: function () {    
    var self = this;
    var app = getApp();    

    //请求添加收货地址数据    
    wx.request({
      url: app.globalData.service + '/api/personal/save',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken,
        realName: self.data.realName,
        mobilePhone: self.data.mobilePhone,
        idCard: self.data.idCard,
        bankName: self.data.bankName,
        bankInfo: self.data.bankInfo,
        verifyCode: self.data.verifyCode,
        bankCard: self.data.bankCard
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //成功后跳转到收货地址页面
          //alert('保存成功！');

          //成功后跳转到确认订单页面
          if (self.data.prevPage == 'personal') {
            var _value = {
              realName: self.data.realName,
              mobilePhone: self.data.mobilePhone,
              idCard: self.data.idCard,
              bankName: self.data.bankName,
              bankInfo: self.data.bankInfo,
              bankCard: self.data.bankCard
            }
            //console.log(_value)
            wx.setStorageSync('personalInfo', _value)
            wx.redirectTo({
              url: '../confirmOrder/confirmOrder?prev=personal'
            });                        
          }

          alert('保存成功');
          self.setData({
            filled: true,
          });
        }
        else{
          alert(res.data.msg);          
        }
      }
    })
  },
  //获取验证码
  getVerifyCode: function (options) {
    var app = getApp();
    var self = this;
    if(self.data.mobilePhone)
    {
      var mobilePhone = this.data.mobilePhone;
      var c = 60;
      var intervalId = setInterval(function () {
        c = c - 1;
        self.setData({
          verifycode_name: '已发送(' + c + 's)',
          buttonDisable: true
        })
        if (c == 0) {
          clearInterval(intervalId);
          self.setData({
            verifycode_name: '重新获取',
            buttonDisable: false
          })
        }
      }, 1000)
      
      //请求验证码
      wx.request({
        url: app.globalData.service + '/api/personal/getVerifyCode',
        method: 'POST',
        data: {
          userToken: app.globalData.userToken,
          mobile: self.data.mobilePhone
        },
        success: function (res) {
          //console.log(res);
          var data = res.data;
          if (data.code == 0) {
            wx.showToast({
              title: '发送成功！',
              icon: 'none',
              duration: 1000,
              mask: true
            })
          }
          else{

          }
        }
      })
    }
    else
    {
      wx.showToast({
        title: '操作失败：手机号码不能为空！',
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }    
  },

  realName_input: function (e) {
    this.setData({
      realName: e.detail.value
    })
    //alert(e.detail.value);
  },
  mobilePhone_input: function (e) {
    this.setData({
      mobilePhone: e.detail.value
    })
    //alert(e.detail.value);
  },
  verifyCode_input: function (e) {
    this.setData({
      verifyCode: e.detail.value
    })
    //alert(e.detail.value);
  },
  idCard_input: function (e) {
    this.setData({
      idCard: e.detail.value
    })
    //alert(e.detail.value);
  },
  bankName_input: function (e) {
    this.setData({
      bankName: e.detail.value
    })
    //alert(e.detail.value);
  },
  bankInfo_input: function (e) {
    this.setData({
      bankInfo: e.detail.value
    })
    //alert(e.detail.value);
  },
  bankCard_input: function (e) {
    this.setData({
      bankCard: e.detail.value
    })
    //alert(e.detail.value);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    util.checkUserInfoAuth();

    var action = options.prev;
    if(action!=null)
    {
      this.setData({
        prevPage: options.prev
      });
    } 

    var app = getApp();
    var self = this;
    //请求个人信息
    wx.request({
      url: app.globalData.service + '/api/personal/query',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          var realName = '';
          var mobilePhone = '';
          var idCard = '';
          var bankName = '';
          var bankInfo = '';
          var bankCard = '';
          if (data.result.realName!=null)
          {
            realName = data.result.realName;
          }
          if (data.result.mobilePhone != null) {
            mobilePhone = data.result.mobilePhone;            
          }
          if (data.result.idCard != null) {
            idCard = data.result.idCard;
          }
          if (data.result.bankName != null) {
            bankName = data.result.bankName;
          }
          if (data.result.realName != null) {
            bankInfo = data.result.bankInfo;
          }
          if (data.result.bankCard != null) {
            bankCard = data.result.bankCard;
          }
          self.setData({
            realName: realName,
            mobilePhone: mobilePhone,
            idCard: idCard,
            bankName: bankName,
            bankInfo: bankInfo,
            bankCard: bankCard
          });
        }

        if (!!self.data.mobilePhone){
          self.setData({
            filled: true,            
          });                 
        }else{
          self.setData({
            filled: false,
          });          
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

function alert(content)
{
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 1000,
    mask: true
  })
}

