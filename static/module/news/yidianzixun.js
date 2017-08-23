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
	let [userLoginName, type] = [window.parent.SYSTEM.user.user_loginname, '12,13,14,15']
	$('#all-order-show').click(() => {
		$('#order-component-show').hide()
		$('.order-table').show()
	})

	let tableData = {
		userName: userLoginName,
		type: type
	}
	orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, () => {

	})
	$('#read-add').click(() => {
		let orderData = {
			contentFlag: false, // 判断是否需要内容
			className: 'button-ydzxydl',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '12',
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
		let orderData = {
			contentFlag: true, // 判断是否需要内容
			className: 'button-ydzxfbpl',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '13',
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
		let orderData = {
			contentFlag: true, // 判断是否需要内容
			className: 'button-ydzxpldz',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '14',
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
		let orderData = {
			contentFlag: false, // 判断是否需要内容
			className: 'button-ydzxwzsc',
			titleContent: '文章地址',
			exampleContent: 'http://www.anyv.net/index.php/article-1509235',
			userLoginName: userLoginName,
			dataType: '15',
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
