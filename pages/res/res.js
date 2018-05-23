
Page({
  data: {
    datas:[]
  },
  onLoad: function (options) {
    console.log(options.data);
    this.setData({
      datas: JSON.parse(options.data)
    })
  }
})
