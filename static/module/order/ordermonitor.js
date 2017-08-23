/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let userOperation = false
	let [infoDialog,
		getDialog,
		feedbackDialog,
		rejectDialog,
		finishDialog,
		pauseDialog] = [{}, {}, {}, {}, {}, {}]
	let [orderId, orderType] = [0, 0]
	let initializeTable = () => {
		//初始化表格
		$('#order-monitor-table').bootstrapTable('destroy')
		$('#order-monitor-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'id',
				searchable: true,
				sortable: true,
				title: '订单号'
			}, {
				field: 'task_create',
				searchable: true,
				sortable: true,
				title: '用户'
			}, {
				field: 'user_name',
				searchable: true,
				title: '类别'
			}, {
				field: 'user_mark',
				searchable: true,
				title: '项目'
			}, {
				field: 'task_time',
				title: '提交时间'
			}, {
				field: 'task_start_mark',
				searchable: true,
				title: '损耗积分'
			}, {
				field: 'task_finish_mark',
				searchable: true,
				title: '实际扣分'
			}, {
				field: 'task_status',
				searchable: true,
				title: '状态',
				formatter: (value, row, index) => {
					switch (value) {
						case '0':
							return '暂停'
							break
						case '1':
							return '开始'
							break
						case '2':
							return '停止'
							break
					}
				}
			}, {
				field: 'task_check_status',
				searchable: true,
				title: '操作',
				formatter: (value, row, index) => {

					let returnValue = ''
					if (value === '1') {
						returnValue = '******'
					} else if (value === '3') {
						returnValue = '******'
					} else {
						returnValue = '<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-default info-content">详细内容</span> ' +
							/*'<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-primary get-content">接受</span> ' +*/
							'<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-success feedback-content">反馈</span> ' +
							'<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-info refuse-content">拒绝</span> ' +
							'<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-warning finish-content">完成</span> ' +
							'<span data-id="' + row.id + '" data-order-number="' + row.id + '" class="label icon-cursor label-danger pause-content">暂停</span>'
					}
					return returnValue
				}
			}, {
				field: 'manpower_content',
				title: '信息反馈'
			}],
			pageNumber: 1,
			pageSize: 12,
			dataField: 'data',//指定后台的数据的名称
			sidePagination: 'server',
			undefinedText: '******',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'manpower/getAllManPowerByType',
			queryParamsType: 'undefined',
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right',
			queryParamsType: 'json',
			queryParams: function (params) {
				var param = {
					pageNumber: params.pageNumber,
					pageSize: params.pageSize,
					type: orderType
				}
				return JSON.stringify(param)
			},
			onClickRow: function (row) {
			},
			onLoadSuccess: function (data) {
			}
		})
	}
	initializeTable()

	$('body').on('click', '.label.info-content', function () {
		orderId = $(this).attr('data-id')
		layer.open({
			title: '信息展示',
			type: 1,
			area: ['35%', '60%'], //宽高
			content: $('#info-content-data-dialog')
		})
	})

	/*	$('body').on('click', '.label.get-content', function () {
			orderId = $(this).attr('data-id')
			layer.confirm('订单号为201708090001的订单，确认已经开始?', {
				btn: ['确认', '取消'] //按钮
			}, function () {
				layer.msg('已经接收', {icon: 1})
			}, function () {
				layer.msg('填写拒绝理由', {icon: 1})
			})
		})*/

	$('body').on('click', '.label.feedback-content', function () {
		orderId = $(this).attr('data-id')
		$('.feedback-number').text(orderId)
		layer.open({
			title: '信息展示',
			type: 1,
			area: ['35%', '60%'], //宽高
			content: $('#feedback-content-data-dialog')
		})
	})

	$('body').on('click', '.label.refuse-content', function () {
		orderId = $(this).attr('data-id')
		$('.reject-number').text(orderId)
		layer.open({
			title: '信息展示',
			type: 1,
			area: ['45%', '80%'], //宽高
			content: $('#reject-content-data-dialog')
		})
	})

	$('body').on('click', '.label.finish-content', function () {
		orderId = $(this).attr('data-id')
		$('.finish-number').text(orderId)
		layer.open({
			title: '信息展示',
			type: 1,
			area: ['35%', '60%'], //宽高
			content: $('#finish-content-data-dialog')
		})
	})

	$('body').on('click', '.label.pause-content', function () {
		orderId = $(this).attr('data-id')
		$('.pause-number').text(orderId)
		layer.open({
			title: '信息展示',
			type: 1,
			area: ['35%', '60%'], //宽高
			content: $('#pause-content-data-dialog')
		})
	})

	$('#sure-content-info').click(function () {

	})

	$('#sure-content-feedback').click(function () {
		let orderData = {
			content: $('.form-control.feedback-content').val()
		}
		api.manpower.manpowerManage.updateManPowerData(orderId, '4', JSON.stringify(orderData), () => {
			initializeTable()
			layer.closeAll()
		})
	})

	$('#sure-content-reject').click(function () {
		let orderData = {
			content: $('.reject-content:checked').val()
		}
		api.manpower.manpowerManage.updateManPowerData(orderId, '3', JSON.stringify(orderData), () => {
			initializeTable()
			layer.closeAll()
		})
	})

	$('#sure-content-finish').click(function () {
		let orderData = {
			mark: $('.form-control.finish-mark').val(),
			content: $('.form-control.finish-content').val()
		}
		api.manpower.manpowerManage.updateManPowerData(orderId, '1', JSON.stringify(orderData), () => {
			initializeTable()
			layer.closeAll()
		})
	})

	$('#sure-content-pause').click(function () {
		let orderData = {
			content: $('.form-control.pause-content').val()
		}
		api.manpower.manpowerManage.updateManPowerData(orderId, '2', JSON.stringify(orderData), () => {
			initializeTable()
			layer.closeAll()
		})
	})

	$('.btn.order').click(function () {
		orderType = $(this).attr('data-type')
		initializeTable()
	})

})

