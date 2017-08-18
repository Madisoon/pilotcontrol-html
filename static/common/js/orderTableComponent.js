/**
 * Created by Msater Zg on 2017/8/11.
 */
// 订单推送系统

define(function (require, exports, module) {
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	const api = require('./api')

	let orderTableComponent = (function () {
		return {
			writeOrderTableDom: function (htmlId, tableData, success) {
				let tableData_ = {
					userName: '',
					type: ''
				}
				tableData = Object.assign(tableData_, tableData)
				let initializeTable = () => {
					$(htmlId).bootstrapTable('destroy')
					$(htmlId).bootstrapTable({
						columns: [{
							checkbox: true
						}, {
							field: 'task_type',
							searchable: true,
							title: '类别'
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
							field: 'task_status',
							searchable: true,
							title: '操作',
							formatter: (value, row, index) => {
								switch (value) {
									case '0':
										return '<button type="button" class="btn btn-primary table-button" disabled="true">开始</button>' +
											'<button type="button" class="btn btn-success table-button">暂停</button>' +
											'<button type="button" class="btn btn-danger table-button">停止</button>'
										break
									case '1':
										return '<button type="button" class="btn btn-primary table-button" disabled="true">开始</button>' +
											'<button type="button" class="btn btn-success table-button">暂停</button>' +
											'<button type="button" class="btn btn-danger table-button">停止</button>'
										break
									case '2':
										return '<button type="button" class="btn btn-primary table-button" disabled="true">开始</button>' +
											'<button type="button" class="btn btn-success table-button">暂停</button>' +
											'<button type="button" class="btn btn-danger table-button">停止</button>'
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
								userLoginName: tableData.userName,
								type: tableData.type
							}
							return JSON.stringify(param)
						},
						pagination: true,
						paginationHAlign: 'left',
						paginationDetailHAlign: 'right'
					})
				}
				initializeTable()
			},
		}
	}())
	return {
		orderTableComponent: orderTableComponent
	}
})