/**
 * Created by Msater Zg on 2017/8/23.
 */
// 订单推送系统

define(function (require, exports, module) {
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	let orderTypeArray = (function () {
		let orderTypeArray = {
			1: '微博-初级粉',
			2: '微博-阅读量',
			3: '微博-高级粉',
			4: '微博-点赞',
			5: '微博-转发评论',
			6: '微信-关注',
			7: '微信-扫码关注',
			8: '微信-阅读点赞',
			9: '微信-收藏转发',
			10: '微信-图文评论',
			11: '微信-评论点赞',
			12: '一点资讯-阅读量',
			13: '一点资讯-发表评论',
			14: '一点资讯-评论点赞',
			15: '一点资讯-文章收藏',
			16: '今日头条-阅读量',
			17: '今日头条-发表评论',
			18: '今日头条-评论点赞',
			19: '今日头条-文章收藏',
			20: '',
			21: '',
			22: '',
			23: '',
			24: '',
			25: '',
			26: '',
			27: ''
		}
		return orderTypeArray
	}())
	return {
		orderTypeArray: orderTypeArray
	}
})