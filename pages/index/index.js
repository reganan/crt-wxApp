// pages/index/index.js
const util = require('../../utils/util.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // indexImg:{
    //   "banner": [{
    //     "id": "1",
    //     "title": "标题",
    //     "imgUrl": "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
    //     "linkUrl": "https://www.baidu.com/"
    //   },
    //   {
    //     "id": "1",
    //     "title": "标题",
    //     "imgUrl": "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
    //     "linkUrl": "https://www.baidu.com/"
    //   }],
    //   "company": {
    //     "url": "http://www.sina.com"
    //   },
    //   "property": {
    //     "url": "http://www.sina.com"
    //   }
    // }    ,
    // product:{
    //   "pro": [{
    //     "id": "123",
    //     "proImg": "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
    //     "title": "给你一座山，让你来养鸡",
    //     "subTitle": "简介",
    //     "ratio": "0.85",
    //     "amount": "5000",
    //     "raiseCount": "122",
    //     "lastDay": "123"
    //   }],
    //   "proing": [{
    //     "id": "123",
    //     "proImg": "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
    //     "title": "给你一座山，让你来养鸡",
    //     "subTitle": "简介",
    //     "ratio": "0.85",
    //     "amount": "5000",
    //     "raiseCount": "122",
    //     "lastDay": "123"
    //   }],
    //   "proed": [{
    //     "id": "123",
    //     "proImg": "http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg",
    //     "title": "给你一座山，让你来养鸡",
    //     "subTitle": "简介",
    //     "ratio": "0.85",
    //     "amount": "5000",
    //     "raiseCount": "122",
    //     "lastDay": "123"
    //   }]
    // }  
  },
  bannerTo:function(e){
    //console.log(e.currentTarget.dataset.link);
    wx.navigateTo({
      url: e.currentTarget.dataset.link
    })
  },
  toProDetail:function(e){
      if (app.globalData.userToken == null) {        
        util.checkUserInfoAuth();
      } else {        
        if (!!e.currentTarget.dataset.id) {
          wx.navigateTo({
            url: "../proDetail/proDetail?id=" + e.currentTarget.dataset.id
          })
        }
      }
  },  
  toNotPublish: function (e) {  
    if (app.globalData.userToken == null) {
      util.checkUserInfoAuth();
    } else {
      if (!!e.currentTarget.dataset.id) {
        wx.navigateTo({
          url: "../notPublish/proDetail?id=" + e.currentTarget.dataset.id
        })
      }
    }
  },
  toProedDetail: function (e){  
    if (app.globalData.userToken == null) {
      util.checkUserInfoAuth();
    } else {
      if (!!e.currentTarget.dataset.id) {
        wx.navigateTo({
          url: "../proedDetail/proedDetail?id=" + e.currentTarget.dataset.id
        })  
      }
    }
  },
  imageLoad: function(){
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth//设置banner高度      
    })
  },
  // showBomb: function () {//显示协议弹框
  //   this.setData({
  //     showBombStatus: true
  //   });
  // },
  closeBomb: function () {//协议弹框关闭按钮
    var self = this;
    self.setData({
      showBombStatus: false
    });
    setTimeout(
      function(){
        self.setData({
          showBombStatus: true
        });
      },100
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
  toGotUserInfo:function(e){
    var self = this;
    console.log(e.detail)
    if (e.detail.userInfo) {//用户按了允许授权按钮      
      self.setData({
        showAuthorizeStatus: false
      });
      app.globalData.userInfo = e.detail.userInfo;

      var inviteCode='';
      try{
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

    //console.log(app);
    //请求banner和简介数据
    wx.request({
      url: app.globalData.service + '/api/index/init',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置banner和简介数据
          //self.data.indexImg = data.result;
          if (data.result) {
            self.setData({
              indexImg: data.result
            });
          }
        }
      }
    })
    //请求产品列表数据
    wx.request({
      url: app.globalData.service + '/api/index/queryProductList',
      method: 'POST',
      data: {
        userToken: app.globalData.userToken
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置产品数据
          //self.data.indexImg = data.result;
          if (data.result) {
            self.setData({
              product: data.result
            });            
          }
        }
      }
    })    

    if (!!options.scene) {
      self.setData({
        inviteCode: decodeURIComponent(options.scene)//从分享小程序码进入的
      });
    } else {
      self.setData({
        inviteCode: options.inviteCode
      });
    }    
    util.checkUserInfoAuth(self.data.inviteCode);

    wx.hideLoading();

    setTimeout(function(){
      if (!!app.globalData.userToken) {//如果userToken为空就不能分享
        wx.showShareMenu();
      } else {
        wx.hideShareMenu();
      }
    },1000)
    
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
    return {      
      path: '/pages/index/index?inviteCode='+app.globalData.userToken
    }
  }
})