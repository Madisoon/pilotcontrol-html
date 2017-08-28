/**
 * Created by Msater Zg on 2017/8/8.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let [otherConfigDialog, operateFlag, otherId] = [{}, true, 0]

	$('#add-other-config').click(() => {
		operateFlag = true
		getSetForm()
	})

	$('#delete-other-config').click(() => {
		let dataOther = $('#other-config-table').bootstrapTable('getSelections', null)
		let dataLen = dataOther.length
		let data = []
		if (dataLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			for (let i = 0; i < dataLen; i++) {
				data.push(dataOther[i].id)
			}
			api.manpower.otherConfigManage.deleteOtherConfig(data.join(','), function (rep) {
				if (rep.result) {
					$('#other-config-table').bootstrapTable('refresh', null)
					layer.msg(' 删 除 成 功 ', {
						icon: 1,
						time: 1200,
					})
				} else {
					layer.msg(' 删 除 失 败 ', {
						icon: 2,
						time: 1200,
					})
				}
			})
		}
	})

	let initializeTable = () => {
		$('#other-config-table').bootstrapTable('destroy')
		$('#other-config-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'other_type',
				searchable: true,
				title: '类型',
				formatter: (value, row, index) => {
					switch (value) {
						case '1':
							return '阅读量'
							break
						case '2':
							return '发布评论'
							break
						case '3':
							return '评论点赞'
							break
						case '4':
							return '文章转发'
							break
						default:
							return '数据错误'
							break
					}
				}
			}, {
				field: 'other_site',
				searchable: true,
				title: '站点'
			}, {
				field: 'other_limit',
				title: '最小数量'
			}, {
				field: 'other_mark',
				title: '单个分值'
			}, {
				field: 'other_status',
				title: '状态',
				formatter: (value, row, index) => {
					switch (value) {
						case '1':
							return '启用'
							break
						case '0':
							return '停止'
							break
					}
				}
			}, {
				field: 'other_abstract',
				title: '说明'
			}, {
				field: 'other_time',
				title: '创建时间'
			}],
			pageNumber: 1,
			pageSize: 20,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'manpower/getAllOtherConfig',
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfo')).token}
			},
			queryParamsType: 'json',
			queryParams: function (params) {
			},
			onClickRow: function (row) {
				operateFlag = false
				otherId = row.id
				getSetForm(row)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		})
	}

	initializeTable()

	let getSetForm = (row = {}) => {
		otherConfigDialog = layer.open({
			title: '添加站点',
			type: 1,
			area: ['50%', '80%'], //宽高
			content: $('#add-other-config-dialog')
		})
		if (operateFlag) {
			// 新建配置
			$('.form-control.other-type').val('1')
			$('.form-control.other-example').val('')
			$('.form-control.other-site').val('')
			$('.form-control.other-limit').val('')
			$('.form-control.other-mark').val('')
			$('.form-control.other-abstract').val('')
		} else {
			// 修改
			$('.form-control.other-type').val(row.other_type)
			$('.form-control.other-example').val(row.other_example)
			$('.form-control.other-site').val(row.other_site)
			$('.form-control.other-limit').val(row.other_limit)
			$('.form-control.other-mark').val(row.other_mark)
			$('.other-status[value=' + row.other_status + ']').prop('checked', true)
			$('.form-control.other-abstract').val(row.other_abstract)
		}
	}

	let getFormValue = () => {
		let otherType = $('.form-control.other-type').val()
		let otherExample = $('.form-control.other-example').val()
		let otherSite = $('.form-control.other-site').val()
		let otherLimit = $('.form-control.other-limit').val()
		let otherMark = $('.form-control.other-mark').val()
		let otherStatus = $('.other-status:checked').val()
		let otherAbstract = $('.form-control.other-abstract').val()
		let otherConfigValue = {
			other_type: otherType,
			other_example: otherExample,
			other_site: otherSite,
			other_limit: otherLimit,
			other_mark: otherMark,
			other_status: otherStatus,
			other_abstract: otherAbstract
		}
		return otherConfigValue
	}

	$('#reserve-other-button').click(() => {
		let otherConfigData = getFormValue()

		if (operateFlag) {
			api.manpower.otherConfigManage.insertOtherConfig(JSON.stringify(otherConfigData), (rep) => {
				layer.close(otherConfigDialog)
				initializeTable()
			})
		} else {
			api.manpower.otherConfigManage.updateOtherConfig(JSON.stringify(otherConfigData), otherId, (rep) => {
				layer.close(otherConfigDialog)
				initializeTable()
			})
		}
	})

})
