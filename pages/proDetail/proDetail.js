// pages/proDetail/proDetail.js
const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // id:0,
    // prodDetail: {
    //   "id": "123",
    //   "bannerType": "1",
    //   "bannerUrl": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",
    //   "proImg": "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
    //   "title": "给你一座山，让你来养鸡",
    //   "subTitle": "简介",
    //   "ratio": "0.85",
    //   "totalAmount": "5000",
    //   "raiseAmount": "100000",
    //   "raiseCount": "122",
    //   "lastDay": "123",
    //   "status": "众筹中",
    //   "payType": "支持5000元",
    //   "proDetail": ["http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg","http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg"],
    //   "evolve": [{
    //     "evolveTime": "2018-09-02",
    //     "evolveContext": "众筹完成度到达80%"
    //   }],
    //   "other": [{
    //     "url": "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
    //     "title": "我是其他项目名字",
    //     "amount": "50000"
    //   }]
    // },
     showBombStatus:false
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
  toNotPublish: function (e) {    
    wx.navigateTo({
      url: "../notPublish/proDetail?id=" + e.currentTarget.dataset.id
    })    
    //console.log(app.globalData.isPromise);

  },
  toConfirmOrder:function(e){
    if (app.globalData.isPromise!=1){
      this.setData({
        showBombStatus: true
      });
    }else{
      wx.navigateTo({
        url: "../confirmOrder/confirmOrder?id=" + this.data.prodDetail.id + "&&payTypeId=" + this.data.prodDetail.payTypeId
      })
    }
  },
  toChoiceType: function (e) {
    if (app.globalData.isPromise != 1) {
      this.setData({
        showBombStatus: true
      });
    } else {
      if (!!this.data.prodDetail.payType && !!this.data.id){
        wx.navigateTo({
          url: "../choiceType/choiceType?type=" + this.data.prodDetail.payTypeId + "&&id=" + this.data.id
        })
      }
    }
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

    } else {//用户按了拒绝按钮      
      self.setData({
        showAuthorizeStatus: true
      });
    }
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;

    wx.showLoading({
      title: '数据加载中',
    })

    this.setData({
      id: options.id
    })
    var id = this.options.id;
    //请求产品详情数据
    wx.request({
      url: app.globalData.service + '/api/product/detail',
      method: 'POST',
      data: {
        id: id
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置产品详情数据
          //console.log(data.result);
          self.setData({
            prodDetail: data.result
          });
        }
      }
    })

  
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

    wx.hideLoading();
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

  // /**
  //  * 用户点击右上角分享
  //  */
  onShareAppMessage: function () {
    return {
      path: '/pages/proDetail/proDetail?id=' + this.data.id +'&&inviteCode=' + app.globalData.userToken
    }
  }
})