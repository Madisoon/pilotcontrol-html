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

	/*
		$('body').on('click', '.order-sure-button', () => {
			alert('点击按钮')
			let orderData = orderModule.orderModule.getOrderForm()
			api.manpower.manpowerManage.insertManPower(JSON.stringify(orderData), (rep) => {
				console.log(rep)
			})
			console.log(orderData)
		})
	*/

	$('#all-order-show').click(() => {
		$('#order-component-show').hide()
		$('.order-table').show()
	})

	$('#single-add').click(() => {
		orderModule.orderModule.writeOrderDom('#order-component-show', true, (rep) => {
			if (rep === 1) {
				initializeTable()
				$('#order-component-show').hide()
				$('.order-table').show()
			} else {
				alert('分数不够')
			}
		})
		$('#order-component-show').show()
		$('.order-table').hide()
		/*layer.open({
			title: '加粉订单',
			type: 1,
			area: ['80%', '95%'], //宽高
			content: $('#add-single-order-dialog')
		})*/
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

	let initializeTable = () => {
		$('#junior-fans-table').bootstrapTable('destroy')
		$('#junior-fans-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'task_type',
				searchable: true,
				title: '订单号'
			}, {
				field: 'task_url',
				searchable: true,
				title: '用户'
			}, {
				field: 'task_number',
				searchable: true,
				title: '状态'
			}, {
				field: 'task_time',
				searchable: true,
				title: '提交时间'
			}, {
				field: 'task_integration',
				searchable: true,
				title: '所耗积分'
			}, {
				field: 'task_number_success',
				searchable: true,
				title: '详情'
			}, {
				field: 'user_name',
				searchable: true,
				title: '操作'
			}, {
				field: 'user_name',
				searchable: true,
				title: '返回说明'
			}],
			pageNumber: 1,
			pageSize: 20,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			formatSearch: function () {
				return '任意搜索'
			},
			url: '' + api.baseUrl + 'manpower/getAllManPower',
			queryParamsType: 'json',
			queryParams: function (params) {
				var param = {
					pageNumber: params.pageNumber,
					pageSize: params.pageSize,
					userLoginName: 'admin',
					type: '1'
				}
				return JSON.stringify(param)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		})
	}
	initializeTable()
})
