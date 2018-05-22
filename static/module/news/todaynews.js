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
	let [userLoginName, type] = [window.parent.SYSTEM.user.user_loginname, '16,17,18,19 ']
	$('#all-order-show').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#all-order-show').addClass('btn-primary')
		$('#order-component-show').hide()
		$('.order-table').show()
	})

	let tableData = {
		userName: userLoginName,
		type: type,
		pilotControlType: '1'
	}
	orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, () => {

	})
	$('#read-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#read-add').addClass('btn-primary')
		let orderData = {
			contentFlag: false, // 判断是否需要内容
			className: 'button-jrttydl',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '16',
		}
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

	$('#remark-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#remark-add').addClass('btn-primary')
		let orderData = {
			contentFlag: true, // 判断是否需要内容
			className: 'button-jrttfbpl',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '17',
		}
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

	$('#remark-good-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#remark-good-add').addClass('btn-primary')
		let orderData = {
			contentFlag: true, // 判断是否需要内容
			className: 'button-jrttpldz',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '18',
		}
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

	$('#collection-articles-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#collection-articles-add').addClass('btn-primary')
		let orderData = {
			contentFlag: false, // 判断是否需要内容
			className: 'button-jrttwzsc',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '19',
		}
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
		$('.order-plan').stop().slideToggle()
	})
})
