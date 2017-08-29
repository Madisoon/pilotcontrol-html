/**
 * Created by Msater Zg on 2017/8/11.
 */
// 订单推送系统

define(function (require, exports, module) {
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	const api = require('./api')
	const orderTypeArray = require('../../common/js/ordertypecommon')
	let writeDialogDom = (row, htmlId) => {
		let orderInfoDialog = {}
		let dom = []
		dom.push('<div id="order-info-dialog" class="al-ui-dialog" style="display: none">')
		dom.push('<form class="form-horizontal dialog-context">')
		dom.push('<div class=" form-group">')
		dom.push('<label class="col-sm-2 control-label">地址</label>')
		dom.push('<div class="col-sm-10 order-show">')
		dom.push('<span >' + row.task_url + '</span>')
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">总数</label>')
		dom.push('<div class="col-sm-10 order-show">')
		dom.push('<span>' + row.task_number + '</span>')
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">所需分值</label>')
		dom.push('<div class="col-sm-10 order-show">')
		dom.push('<span>' + row.task_start_mark + '</span>')
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">实际分值</label>')
		dom.push('<div class="col-sm-10 order-show">')
		dom.push('<span>' + row.task_finish_mark + '</span>')
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">当前状态</label>')
		dom.push('<div class="col-sm-10 order-show">')

		switch (row.task_check_status) {
			case '0':
				dom.push('<span style="color: blue; font-weight: 600">正在执行</span>')
				break
			case '1':
				dom.push('<span style="color: forestgreen; font-weight: 600">已完成</span>')
				break
			case '2':
				dom.push('<span style="color: yellow; font-weight: 600">暂停</span>')
				break
			case '3':
				dom.push('<span style="color: red; font-weight: 600">已拒绝</span>')
				break
		}
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">下单时间</label>')
		dom.push('<div class="col-sm-10 order-show">')
		dom.push('<span>' + row.task_time + '</span>')
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">订单内容</label>')
		dom.push('<div class="col-sm-10 order-show">')
		if (row.task_context === undefined) {
			dom.push('<span>内容为空!</span>')
		} else {
			dom.push('<span>' + row.task_context + '</span>')
		}
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">补充说明</label>')
		dom.push('<div class="col-sm-10 order-show">')
		if (row.task_supplement === undefined) {
			dom.push('<span>内容为空!</span>')
		} else {
			dom.push('<span>' + row.task_supplement + '</span>')
		}
		dom.push('</div>')
		dom.push('</div>')
		dom.push('<div class="form-group">')
		dom.push('<label class="col-sm-2 control-label">反馈</label>')
		dom.push('<div class="col-sm-10 order-show">')
		if (row.manpower_contents === null || row.manpower_contents === undefined) {
			dom.push('<span>内容为空!</span>')
		} else {
			dom.push('<p>' + row.manpower_contents + '</p>')
		}
		dom.push('</div>')
		dom.push('</div>')
		dom.push('</form>')
		dom.push('<div class="absolute-dialog-action">')
		/*dom.push('  <button type="button" class="btn btn-success" id="order-info-cancel">取消</button>')*/
		if (row.task_status === '1') {
			dom.push('  <button type="button" class="btn btn-primary" id="order-info-start" data-status = "0">暂停</button>')
			dom.push('  <button type="button" class="btn btn-danger" id="order-info-stop" data-status = "2">停止</button>')
		} else if (row.task_status === '0') {
			dom.push('  <button type="button" class="btn btn-primary" id="order-info-start" data-status = "1">开始</button>')
			dom.push('  <button type="button" class="btn btn-danger" id="order-info-stop" data-status = "2">停止</button>')
		} else {
			dom.push('  <button type="button" class="btn btn-primary" id="order-info-start" disabled="true">开始</button>')
			dom.push('  <button type="button" class="btn btn-danger" id="order-info-stop" disabled="true">停止</button>')
		}
		dom.push('</div>')
		dom.push('</div>')
		$('#order-info-dialog').remove()
		$('.twitter-html-function').append(dom.join(''))
		orderInfoDialog = layer.open({
			title: '订单详情',
			type: 1,
			area: ['50%', '80%'], //宽高
			content: $('#order-info-dialog')
		})

		$('#order-info-cancel').click(() => {
			layer.close(orderInfoDialog)
		})
		$('#order-info-start').click(function () {
			let orderStatus = $(this).attr('data-status')
			api.manpower.manpowerManage.changeOrderStatus(row.id, orderStatus, (rep) => {
				layer.close(orderInfoDialog)
				$(htmlId).bootstrapTable('refresh')
			})
		})
		$('#order-info-stop').click(function () {
			let orderStatus = $(this).attr('data-status')
			api.manpower.manpowerManage.changeOrderStatus(row.id, orderStatus, (rep) => {
				layer.close(orderInfoDialog)
				$(htmlId).bootstrapTable('refresh')
			})
		})
	}

	let initializeTable = (htmlId, tableData, success) => {
		$(htmlId).bootstrapTable('destroy')
		$(htmlId).bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'id',
				searchable: true,
				title: '订单号'
			}, {
				field: 'task_type',
				searchable: true,
				title: '类别',
				formatter: (value, row, index) => {
					return orderTypeArray.orderTypeArray[value]
				}
			}, {
				field: 'task_time',
				searchable: true,
				title: '开始时间'
			}, {
				field: 'task_end_time',
				searchable: true,
				title: '结束时间'
			}, {
				field: 'task_start_mark',
				searchable: true,
				title: '理应扣分'
			}, {
				field: 'task_finish_mark',
				searchable: true,
				title: '实际扣分'
			}, {
				field: 'task_check_status',
				searchable: true,
				title: '审核状态',
				formatter: (value, row, index) => {
					switch (value) {
						case '0':
							return '<div style="color: blue; font-weight: 600;font-size: 12px">正在执行</div>'
							break
						case '1':
							return '<div style="color: forestgreen; font-weight: 600;font-size: 12px">已完成</div>'
							break
						case '2':
							return '暂停'
							break
						case '3':
							return '<div style="color: red; font-weight: 600;font-size: 12px">被拒绝</div>'
							break
					}
				}
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
				field: 'manpower_contents',
				searchable: true,
				title: '信息反馈'
			}],
			pageNumber: 1,
			pageSize: 20,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '******',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'manpower/getAllManPower',
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfo')).token}
			},
			queryParamsType: 'json',
			queryParams: function (params) {
				var param = {
					pageNumber: params.pageNumber,
					pageSize: params.pageSize,
					userLoginName: tableData.userName,
					type: tableData.type,
					pilotControlType: tableData.pilotControlType
				}
				return JSON.stringify(param)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right',
			onClickRow: function (row) {
				writeDialogDom(row, htmlId)
			},
		})
	}

	let orderTableComponent = (function () {
		return {
			writeOrderTableDom: function (htmlId, tableData, success) {
				let tableData_ = {
					userName: '',
					type: ''
				}
				tableData = Object.assign(tableData_, tableData)
				initializeTable(htmlId, tableData, success)
			},
		}
	}())
	return {
		orderTableComponent: orderTableComponent
	}
})