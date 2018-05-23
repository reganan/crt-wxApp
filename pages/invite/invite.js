// pages/invite/invite.js
const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    init: {
      // "inviteMaxCount": "99",
      // "inviteCount": "80",
      // "inviteImg": "http://163.com/sdf.jpg",
      // "prizeImg":"http://163.com/sdf.jpg",
      // "prizeName": "价值45元的鸡蛋",
      // "rebate": "200",
      // "rebateAble": "100",
      // "rebateTotal": "900"
    },
    showBombStatus: false
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
    //console.log(app.globalData.userToken)
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

    this.getInit();
  },
  toGotUserInfo: function (e) {
    var self = this;
    //console.log(e.detail)
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
        function () {
          self.onLoad();
        }
        , 500)

    } else {//用户按了拒绝按钮
      self.setData({
        showAuthorizeStatus: true
      });
    }
  },
  toGiftConfirm: function () {
    if (!!app.globalData.userToken) {
      wx.navigateTo({
        url: "../giftConfirm/giftConfirm"
      })
    }
  },
  applyCash: function () {
    //申请提现
    var self = this;
    var rebateAble = self.data.init.rebateAble;

    if (rebateAble == 0) {
      wx.showModal({
        title: '提示',
        content: '金额中含有众筹暂未结束订单奖励金，目前可直接提现金额为0元',
        showCancel: false,
        confirmColor: '#d2a061'
      })
    } else {
      wx.showModal({
        title: '提示',
        confirmText: '申请提现',
        confirmColor: '#d2a061',
        content: '目前可直接提现金额为' + rebateAble + '元（如有未能提现金额，即为众筹暂未结束订单奖励金），是否直接申请提现？', success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
            wx.request({
              url: app.globalData.service + '/api/invite/apply',
              method: 'POST',
              data: {
                userToken: app.globalData.userToken,
                amount: rebateAble
              },
              success: function (res) {
                // console.log(res);
                var data = res.data;
                if (data.code == 0) {
                  wx.showToast({
                    title: '申请成功',
                    icon: 'success',
                    duration: 2000
                  })

                  self.onLoad();
                } else {
                  wx.showToast({
                    title: '申请失败',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              }
            })
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }

  },
  shareFriendCircle: function () {
    ////分享朋友圈
    var self = this;
    self.getWxacode();

  },
  getWxacode: function () {
    //获取小程序码图片
    var self = this;
    var userToken = app.globalData.userToken;

    // wx.request({
    //   url: app.globalData.service + '/api/invite/getWxaCodeImgByIndex',
    //   method: 'GET',
    //   data: {
    //     'userToken': userToken
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     // var data = res.data;
    //     // if (data.code == 0) {          
    //     //   if (data.result) {           
    //     //     self.setData({
    //     //       shareImgSrc: data.result             
    //     //     });
    //     //   }
    //     // }
    //   }
    // })    
    if (!!app.globalData.userToken) {
      self.setData({
        shareImgSrc: app.globalData.service + '/api/invite/getWxaCodeImgByIndex?userToken=' + app.globalData.userToken,
        showWxaCodeImg: true
      });
    }

  },
  saveShareImg: function () {
    var self = this;
    wx.getImageInfo({
      src: self.data.shareImgSrc,
      success: function (res) {
        var imgPath = res.path;
        console.log(imgPath)
        //获取相册授权
        // wx.getSetting({
        //   success(res) {
        //     if (!res.authSetting['scope.writePhotosAlbum']) {
        //       wx.authorize({
        //         scope: 'scope.writePhotosAlbum',
        //         success() { 
        //           console.log('ss')
        //           //wx.saveImageToPhotosAlbum();                 
        //           self.saveImageToPhoto(imgPath);
        //         },
        //         fail(){
        //           console.log('aaa')
        //           self.setData({
        //             showWxaCodeImg: false
        //           });
        //         }
        //       })
        //     }else{
        //       self.saveImageToPhoto(imgPath);
        //     }
        //   }
        // })

        self.saveImageToPhoto(imgPath);

      }
    })
  },
  saveImageToPhoto: function (imgPath) {
    //保存图片到相册
    var self = this;
    wx.saveImageToPhotosAlbum({
      filePath: imgPath,
      success(res) {
        wx.showModal({
          title: '成功保存图片',
          content: '已成功为您保存图片，即刻分享朋友圈赚取现金。',
          showCancel: false,
          confirmColor: '#d2a061',
          success: function (res) {
            if (res.confirm) {
              //console.log('用户点击确定');
              self.setData({
                showWxaCodeImg: false
              });
            }
          }
        })
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          console.log("打开设置窗口");
          wx.openSetting({
            success(settingdata) {
              console.log(settingdata)
              if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                console.log("获取权限成功，再次点击图片保存到相册")
              } else {
                console.log("获取权限失败")
                wx.showToast({
                  title: '获取相册权限失败！',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
                self.setData({
                  showWxaCodeImg: false
                });
              }
            }
          })
        }
      }
    })
  },
  getInit:function(){
    var self = this;
    wx.request({
      url: app.globalData.service + '/api/invite/init',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //console.log(data.result)         
          if (data.result) {
            var inviteRatio = parseInt((data.result.inviteCount / data.result.inviteMaxCount) * 100);//邀请进度条比例            
            self.setData({
              init: data.result,
              inviteRatio: inviteRatio
            });
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;    
    
    self.getInit();

    self.setData({
      inviteCode: options.inviteCode
    });
    //var inviteCode = options.inviteCode;
    util.checkUserInfoAuth(self.data.inviteCode);

    // if (app.globalData.isPromise != 1) {
    //   this.setData({
    //     showBombStatus: true
    //   });
    // }

    if (!!app.globalData.userToken) {//如果userToken为空就不能分享
      wx.showShareMenu();
    } else {
      wx.hideShareMenu();
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
  onShareAppMessage: function (res) {   
    if (res.from === 'button') {
      return {
        imageUrl: this.data.init.shareToImg,
        path: '/pages/proDetail/proDetail?id=' + this.data.init.products[0].id + '&&inviteCode=' + app.globalData.userToken
      }
    }else{
      return {        
        path: '/pages/invite/invite?inviteCode=' + app.globalData.userToken
      }
    }   

  }
})