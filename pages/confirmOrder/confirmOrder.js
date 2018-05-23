// pages/confirmOrder/confirmOrder.js
const util = require('../../utils/util.js')
var app = getApp();

Page({
  /**
   * 页面的初始数据
   * buyNum购买数量 pickNum提货数量  remainMoney代售款 totalMoney总价 total合计
   */
  data: {
    // orderInfo: {
    //   "id": "123",
    //   "proImg": "http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg",
    //   "title": "给你一座山，让你来养鸡",
    //   "subTitle": "给你一座山，让你来养鸡",
    //   "amount": "5000",
    //   "repayMinCount": "2",
    //   "repayMaxCount": "40",
    //   "repayDate": "2018-09-09",
    //   "repayName": "回报货物名称",
    //   "repayAmount": "1000",
    //   "giftCount": "1",
    //   "giftName": "礼品名称",
    //   "freight": "0",
    //   "defAddress":{
    //     "receiverName": "收货人",
    //     "receiverPhone": "收货人手机号码",
    //     "receiverAddress": "收货人地址"
    //   },
    //   "personalInfo":{}
    // },
    // buyNum:'1',
    // pickNum: '4',
    // remainMoney:'5780',
    // totalMoney: '5000',
    // total: '5000',
    // productId:'1',
    // payTypeId:'1'
    addrErr: '',
    infoErr:'',
    agreeErr:''
  },
  service_agree: function(e){
    this.setData({
      agree: e.detail.value
    });
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  onShareAppMessage: function (res) {
    var self = this;
    var app = getApp();

    var title = self.data.orderInfo.title;
    var desc = self.data.orderInfo.subTitle;
    var path = '/pages/proDetail/proDetail?id=' + self.data.productId + '&inviteCode=' + app.globalData.userToken;
    var imageUrl = self.data.orderInfo.productImg;

    // if (this.data.orderInfo.defAddress == null) {
    //   alert('请先配置收货人信息！');
    //   return;
    // }

    //console.log(title)
    //console.log(desc)
    //console.log(path)

    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log('button~~~~')
    }
    return {
      title: title,
      desc: desc,
      path: path,
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
        //console.log('转发成功')
        self.payHelpOrder();
      },
      fail: function (res) {
        // 转发失败
        //console.log('转发失败')
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  },
  /* 购买数量点击减号 */
  bindMinus: function () {
    var buyNum = this.data.buyNum;
    var amount = this.data.orderInfo.amount;  
    var pickNum = this.data.pickNum;
    var isRepay = this.data.orderInfo.isRepay;   

    // 如果大于1时，才可以减  
    if (buyNum > 1) {
      buyNum--;
      var totalMoney = buyNum * amount;
      var total = totalMoney + this.data.orderInfo.freight;       
      if (pickNum > buyNum * this.data.orderInfo.repayMaxCount){
        pickNum = buyNum * this.data.orderInfo.repayMaxCount;        
      }
      if (pickNum == (buyNum + 1) * this.data.orderInfo.repayMinCount){
        pickNum = pickNum - this.data.orderInfo.repayMinCount;
      }
      
      if (isRepay==1){//有回报实物（目前是香榧鸡众筹）
        var remainMoney = ((this.data.orderInfo.repayMaxCount * buyNum - this.data.orderInfo.repayMinCount * buyNum) - (pickNum - this.data.orderInfo.repayMinCount * buyNum)) * this.data.orderInfo.repayAmount;
      } else if (isRepay == 2){        
        var remainMoney = this.data.orderInfo.income * buyNum
      }
      
      var giftCount = 'orderInfo.giftCount';
      
      this.setData({
        buyNum: buyNum,
        totalMoney: totalMoney,
        pickNum: pickNum,
        [giftCount]: this.data.giftCount * buyNum,
        remainMoney: remainMoney,
        total: total
      });
    }
  },
  /* 购买数量点击加号 */
  bindPlus: function () {
    var buyNum = this.data.buyNum;
    var amount = this.data.orderInfo.amount;  
    var pickNum = this.data.pickNum; 
    var ableBuyNum = this.data.orderInfo.ableBuyNum;
    var isRepay = this.data.orderInfo.isRepay;

    //ableBuyNum=0 不限购
    if (buyNum < ableBuyNum || ableBuyNum==0) {
      buyNum++;
      var totalMoney = buyNum * amount;
      var total = totalMoney + this.data.orderInfo.freight;
      if (pickNum < buyNum * this.data.orderInfo.repayMinCount) {
        pickNum = buyNum * this.data.orderInfo.repayMinCount;
      }
      // else{
      //   pickNum = pickNum + this.data.orderInfo.repayMinCount;
      // }
      if (isRepay == 1) {//有回报实物（目前是香榧鸡众筹）
        var remainMoney = ((this.data.orderInfo.repayMaxCount * buyNum - this.data.orderInfo.repayMinCount * buyNum) - (pickNum - this.data.orderInfo.repayMinCount * buyNum)) * this.data.orderInfo.repayAmount;
      } else if (isRepay == 2) {
        var remainMoney = this.data.orderInfo.income * buyNum
      }
      
      var giftCount = 'orderInfo.giftCount';
      this.setData({
        buyNum: buyNum,//购买数量
        totalMoney: totalMoney,//总价
        pickNum: pickNum,//提货数量
        [giftCount]: (this.data.giftCount * buyNum),
        remainMoney: remainMoney,//余款
        total: total 
      });
    }    
  },  
  /* 提货数量点击减号 */
  bindJian: function () {
    var buyNum = this.data.buyNum;
    var pickNum = this.data.pickNum;
    var repayMaxCount = this.data.orderInfo.repayMaxCount;
    // 如果大于最小量时，才可以减
    if (pickNum > this.data.orderInfo.repayMinCount * buyNum) {
      pickNum--;
    }
    var remainMoney = (repayMaxCount * buyNum - pickNum) * this.data.orderInfo.repayAmount;
    this.setData({
      pickNum: pickNum,
      remainMoney: remainMoney  
    });
  },
  /* 提货数量点击加号 */
  bindJia: function () {
    var buyNum = this.data.buyNum;
    var pickNum = this.data.pickNum;
    var repayMaxCount = this.data.orderInfo.repayMaxCount;    
    if (pickNum < repayMaxCount * buyNum) {
      pickNum++;
    }
    var remainMoney = (repayMaxCount * buyNum - pickNum) * this.data.orderInfo.repayAmount;
    this.setData({
      pickNum: pickNum, 
      remainMoney: remainMoney
    });
  },  
  //存储当前页面临时数据
  saveData:function(e){
    var action = e.currentTarget.dataset.action;
    //console.log(action);

    //console.log(this.data);
    wx.setStorageSync('confirmOrder_data', this.data);
    //app.globalData.tmp.confirmOrder_data = this.data;

    var url = '';
    if(action == 'order')
    {
      url = '../address/address?prev=order';
    }
    else if (action == 'personal')
    {
      url = '../personalInfo/personalInfo?prev=personal';
    }

    app.globalData.confirmOrder_page++;
    if (app.globalData.confirmOrder_page > 1) {
      console.log('不保留当前页面跳转');
      wx.redirectTo({
        url: url
      })
    }
    else {
      console.log('保留当前页面跳转');
      wx.navigateTo({
        url: url
      })
    }         
  },
  //帮助支付
  payHelpOrder: function () {
    console.log('开始帮助支付~~~~');
    var self = this;
    var app = getApp();

    //onShareAppMessage();

    if (this.data.orderNo != null) {
      alert('不可重复提交！');
      wx.switchTab({
        url: '/pages/index/index'
      })
      return;
    }    

    //console.log(this.data);
    var productId = this.data.productId;
    var payTypeId = this.data.payTypeId;
    var category = this.data.orderInfo.category;
    var isRepay = this.data.orderInfo.isRepay
    
    //购买数量
    var proCount = this.data.buyNum;
    //回报货物名称
    var repayName = '';
    //提货数量
    var repayCount = 0;
    //代售款
    var repayTotalAmount = 0;
    //总价
    var totalMoney = 0;
    //合计
    var total = 0;
    //礼品数量
    var giftCount = '';
    //礼品名称
    var giftName = '';

    //收货人
    var receiverName = '';
    //收货人手机
    var receiverPhone = '';
    //收货人地址
    var receiverAddress = '';
    //真实姓名
    var realName = '';
    //手机号码
    var mobilePhone = '';
    //身份证号
    var idCard = '';
    //银行名称
    var bankName = '';
    //开户银行
    var bankInfo = '';
    //银行卡号
    var bankCard = '';

    try
    {
      receiverName = this.data.orderInfo.defAddress.receiverName;
      receiverPhone = this.data.orderInfo.defAddress.receiverPhone;
      receiverAddress = this.data.orderInfo.defAddress.receiverAddress;
      realName = this.data.orderInfo.personalInfo.realName;
      mobilePhone = this.data.orderInfo.personalInfo.mobilePhone;
      idCard = this.data.orderInfo.personalInfo.idCard;
      bankName = this.data.orderInfo.personalInfo.bankName;
      bankInfo = this.data.orderInfo.personalInfo.bankInfo;
      bankCard = this.data.orderInfo.personalInfo.bankCard;      
    }
    catch(e)
    {
      console.log(e);
    }    

    //创建订单
    wx.request({
      url: app.globalData.service + '/api/order/create',
      method: 'POST',
      data: {
        id: productId,
        payTypeId: payTypeId,
        userToken: app.globalData.userToken,
        proCount: proCount,
        repayName: repayName,
        repayCount: repayCount,
        repayTotalAmount: repayTotalAmount,
        totalMoney: totalMoney,
        payAmount: total,
        giftCount: giftCount,
        giftName: giftName,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverAddress: receiverAddress,
        realName: realName,
        mobilePhone: mobilePhone,
        idCard: idCard,
        bankName: bankName,
        bankInfo: bankInfo,
        bankCard: bankCard,
        category: category,
        isRepay: isRepay
      },
      success: function (res) {
        console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //生成订单成功
          //console.log(data.result);
          var orderNo = data.result.orderNo;
          self.setData({
            orderNo: data.result.orderNo
          });
          console.log('生成订单成功~~~~');

          wx.redirectTo({
            url: '../shareSuccess/shareSuccess',
          })
          // wx.switchTab({
          //   url: '/pages/order/order'
          // })          
        }
        else
        {
          alert(data.msg);
        }
      }
    })
  },
  //支付
  payOrder:function()
  {
    var self = this;
    var app = getApp();

    if(this.data.orderNo!=null)
    {
      alert('不可重复提交！');
      wx.switchTab({
        url: '/pages/index/index'
      })
      return;
    }

    //console.log(this.data);
    var productId = this.data.productId;

    //console.log(this.data);
    if(productId==null)
    {
      alert('产品ID不能为空！');
      return;
    }

    var payTypeId = this.data.payTypeId;
    //购买数量
    var proCount = this.data.buyNum;
    //回报货物名称
    var repayName = this.data.orderInfo.repayName;
    //提货数量
    var repayCount = this.data.pickNum;
    //代售款
    var repayTotalAmount = this.data.remainMoney;
    //总价
    var totalMoney = this.data.totalMoney;
    //合计
    var total = this.data.total;
    //礼品数量
    var giftCount = this.data.orderInfo.giftCount;
    //礼品名称
    var giftName = this.data.orderInfo.giftName;  


    //收货人
    var receiverName = '';  
    //收货人手机
    var receiverPhone = '';
    //收货人地址
    var receiverAddress = '';
    
    if (this.data.orderInfo.defAddress == null) {
      alert('请先配置收货人信息！');
      self.setData({
        toView: 'addr',
        addrErr: 'errmsg'
      });
      return;
    }

    if (this.data.orderInfo.category==1){
      if (this.data.orderInfo.personalInfo == null) {
        alert('请先配置收益人信息！');
        self.setData({
          toView: 'info',
          infoErr: 'errmsg'
        });
        return;
      }

      if (this.data.agree == null || this.data.agree == '') {
        alert('请先阅读服务协议并确认同意！');
        self.setData({
          toView: 'agree',
          agreeErr: 'errmsg'
        });
        return;
      }
    }

    //真实姓名
    var realName = '';
    //手机号码
    var mobilePhone = '';
    //身份证号
    var idCard = '';
    //银行名称
    var bankName = '';
    //开户银行
    var bankInfo = '';
    //银行卡号
    var bankCard = '';  

    try {
      receiverName = this.data.orderInfo.defAddress.receiverName;
      receiverPhone = this.data.orderInfo.defAddress.receiverPhone;
      receiverAddress = this.data.orderInfo.defAddress.receiverAddress;
      realName = this.data.orderInfo.personalInfo.realName;
      mobilePhone = this.data.orderInfo.personalInfo.mobilePhone;
      idCard = this.data.orderInfo.personalInfo.idCard;
      bankName = this.data.orderInfo.personalInfo.bankName;
      bankInfo = this.data.orderInfo.personalInfo.bankInfo;
      bankCard = this.data.orderInfo.personalInfo.bankCard;
    }
    catch (e) {
      console.log(e);
    }

    var category = this.data.orderInfo.category;
    var isRepay = this.data.orderInfo.isRepay    

    wx.showLoading({
      title: '提交支付中',
    })
    //创建订单
    wx.request({
      url: app.globalData.service + '/api/order/create',
      method: 'POST',
      data: {
        id: productId,
        payTypeId: payTypeId,
        userToken: app.globalData.userToken,
        proCount: proCount,
        repayName: repayName,
        repayCount: repayCount,
        repayTotalAmount: repayTotalAmount,
        totalMoney: totalMoney,
        payAmount: total,
        giftCount: giftCount,
        giftName: giftName,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverAddress: receiverAddress,
        realName: realName,
        mobilePhone: mobilePhone,
        idCard: idCard,
        bankName: bankName,
        bankInfo: bankInfo,
        bankCard: bankCard,
        category: category,
        isRepay: isRepay
      },
      success: function (res) {
        //console.log(res);
        var data = res.data;
        if (data.code == 0) {
          //设置产品详情数据
          //console.log(data.result);
          var orderNo = data.result.orderNo;
          self.setData({
            orderNo:data.result.orderNo
          });
          if(orderNo!= null)
          {
            //调用统一下单接口
            wx.request({
              url: app.globalData.service + '/api/order/pay',
              method: 'POST',
              data: {
                orderNo: orderNo,
                userToken: app.globalData.userToken
              },
              success: function (res) {
                //console.log(res);
                var data = res.data;
                if (data.code == 0) {
                  //统一下单返回
                  //console.log(data.result);

                  var payinfo = data.result.obj;
                  var orderNo = data.result.msg;
                  //var jsonObj = JSON.stringify(payinfo);
                  var jsonObj = JSON.parse(payinfo);

                  jsonObj.success = function (res) {
                    //console.log(res);
                    //  alert('支付成功');
                    wx.switchTab({
                      url: '/pages/order/order'
                    })
                  };
                  jsonObj.fail = function (res) {
                     //console.log(res);
                     //alert('支付失败,将不生成订单！');
                     wx.showToast({
                       title: '支付失败,将不生成订单！',
                       icon: 'none',
                       duration: 2000,
                       mask: true
                     })
                     setTimeout(function(){
                       wx.switchTab({
                         url: '/pages/index/index'
                       })
                     },2000)                     
                  };

                  // jsonObj.complete = function(res){
                  //   //console.log(res);
                  //   wx.switchTab({
                  //     url: '/pages/order/order'
                  //   })
                  // }

                  //微信支付接口
                  wx.requestPayment(jsonObj);
                }
                else
                {
                  alert(data.msg);
                }
              }
            })
         }        

        }
        else
        {
          alert(data.msg);
        }
      },
      complete:function()
      {
        wx.hideLoading();
      }
    })
  },
  toshare:function(){
    if (this.data.orderInfo.defAddress == null) {
      alert('请先配置收货人信息！');
      this.setData({
        toView: 'addr',
        addrErr: 'errmsg'
      });
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var app = getApp();    

    util.checkUserInfoAuth();

    if (options.prev == 'addr')
    {
      //还原用户数据
      var datas = wx.getStorageSync('confirmOrder_data');

      if(datas==null)
      {
        console.log('getStorageSync.datas==null');
        datas = app.globalData.tmp.confirmOrder_data;
        console.log(datas);
      }
      console.log('confirmOrder_data=>');
      console.log(datas);
      self.setData({
        orderInfo: datas.orderInfo,
        productId: datas.productId,
        payTypeId: datas.payTypeId,
        buyNum: datas.buyNum,
        pickNum: datas.pickNum,
        remainMoney: datas.remainMoney,
        totalMoney: datas.totalMoney,
        total: datas.total,
        giftCount: datas.giftCount
      });

      //加载收货地址信息
      var receiverAddr = wx.getStorageSync('addrInfo');
      var defAddress = 'orderInfo.defAddress';
      self.setData({
        [defAddress]: receiverAddr
      });

    }else
    //个人信息跳转回来
    if (options.prev == 'personal')
    {
      //还原用户数据
      var datas = wx.getStorageSync('confirmOrder_data');
      self.setData({
        orderInfo: datas.orderInfo,
        productId: datas.productId,
        payTypeId: datas.payTypeId,
        buyNum: datas.buyNum,
        pickNum: datas.pickNum,
        remainMoney: datas.remainMoney,
        totalMoney: datas.totalMoney,
        total: datas.total,
        giftCount: datas.giftCount
      });

      //加载个人信息
      var personalInfo = wx.getStorageSync('personalInfo');
      var personal = 'orderInfo.personalInfo';
      self.setData({
        [personal]: personalInfo
      });

    }
    else
    {
      var productId = options.id;
      var payTypeId = options.payTypeId; 
      
      //请求产品详情数据
      wx.request({
        url: app.globalData.service + '/api/order/confirm',
        method: 'POST',
        data: {
          id: productId,
          payTypeId: payTypeId,
          userToken: app.globalData.userToken
        },
        success: function (res) {
          //console.log(res);
          var data = res.data;
          if (data.code == 0) {
            //设置产品详情数据
            console.log(data.result);            

            self.setData({
              orderInfo: data.result,
              giftCount: data.result.giftCount,
              buyNum: 1,
              pickNum: data.result.repayMinCount,
              //remainMoney: (data.result.repayMaxCount - data.result.repayMinCount) * data.result.repayAmount,
              totalMoney: data.result.amount,
              total: data.result.amount + data.result.freight,
              productId: parseInt(productId),
              payTypeId: parseInt(payTypeId)
            });

            if (data.result.isRepay==2){
              self.setData({
                remainMoney: data.result.income
              })              
            }else{
              self.setData({
                remainMoney: (data.result.repayMaxCount - data.result.repayMinCount) * data.result.repayAmount
              })
            }
          }
          else
          {
            alert(data.msg);
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {
  
  // }
})
function alert(content) {
  wx.showToast({
    title: content,
    icon: 'none',
    duration: 2000,
    mask: true
  })
}