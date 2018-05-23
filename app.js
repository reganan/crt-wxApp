//app.js
App({  
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var self = this;
    /*
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              if (self.globalData.userToken == null || self.globalData.isPromise == -1) {
                // 登录
                wx.login({
                  success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                      var code = res.code;
                      //发起网络请求
                      //请求banner和简介数据
                      wx.request({
                        url: self.globalData.service + '/api/index/onLogin',
                        method: 'POST',
                        data: {
                          code: code,
                          userInfo: self.globalData.userInfo
                        },
                        success: function (res) {
                          //console.log(res);
                          var data = res.data;
                          if (data.code == 0) {
                            //self.data.indexImg = data.result;
                            self.globalData.userToken = data.result.userToken;
                            self.globalData.isPromise = data.result.isPromise;
                            self.globalData.servicePhone = data.result.servicePhone;
                          }
                        }
                      })
                    } else {
                      console.log('登录失败！' + res.errMsg)
                    }
                  }
                })
              }

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })     
    */    
  },
  
  globalData: {
    userInfo: null,
    //用户标识
    userToken: null,
    //是否已经承诺0未承诺1已承诺，初始值-1'
    isPromise: -1,
    servicePhone: '',
    userVersion:'',
    confirmOrder_page: 0,
    service: "http://192.168.1.176:9093"
    //service: "http://10.20.20.60:9193"
  }
})