/**
 * Created by Msater Zg on 2017/8/9.
 */
/**
 * Created by Msater Zg on 2017/8/8.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	const orderModule = require('../../common/js/ordermodule')
	const orderTableComponent = require('../../common/js/orderTableComponent')
	let [userLoginName, type] = [window.parent.SYSTEM.user.user_loginname, '1']

	$('#all-order-show').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#all-order-show').addClass('btn-primary')
		$('#order-component-show').hide()
		$('.order-table').show()
	})

	let orderData = {
		contentFlag: false, // 判断是否需要内容
		className: 'button-cjf',
		titleContent: '微博地址或id',
		exampleContent: 'http://weibo.com/u/1742727537 或者 http:/微博ID：1742727537',
		userLoginName: userLoginName,
		dataType: type,
	}

	let tableData = {
		userName: userLoginName,
		type: type,
		pilotControlType: '1'
	}
	orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, () => {

	})
	$('#single-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#single-add').addClass('btn-primary')
		orderModule.orderModule.writeOrderDom('#order-component-show', orderData, (rep) => {
			if (rep === 1) {
				orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, (rep) => {
				})
				$('#order-component-show').hide()
				$('.order-table').show()
			} else {
				layer.msg('抱歉分数不够不可以下单!')
			}
		})
		$('#order-component-show').show()
		$('.order-table').hide()
	})

	$('#multi-add').click(() => {
		layer.open({
			title: '加粉订单',
			type: 1,
			area: ['80%', '95%'], //宽高
			content: $('#add-multi-order-dialog')
		})
	})

	$('.mode-execution').click(() => {
		let modeValue = $('.mode-execution:checked').val()
		$('.order-plan').stop().slideToggle()
	})
})
