/**
 * Created by Msater Zg on 2017/8/8.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let [messageDialog, operationType, messageId] = [{}, 1, '']

	api.manpower.planManage.getAllPlan((rep) => {
		let domOption = []
		for (planItem of rep.data) {
			domOption.push('<option value="' + planItem.id + '">' + planItem.plan_name + '</option>')
		}
		$('.message-plan').append(domOption.join(''))
	})

	let getSetFormValue = (row = {}) => {
		messageDialog = layer.open({
			title: '添加站点',
			type: 1,
			area: ['50%', '55 %'], //宽高
			content: $('#add-message-config-dialog')
		})
		if (operationType) {
			// 新建人员
			$('.message-name').val('')
			$('.message-number').val('')
			$('.people-status[value=1]').prop('checked', true)
			$('.message-config').prop('checked', false)
		} else {
			$('.message-name').val(row.people_name)
			$('.message-number').val(row.people_number)
			$('.people-status[value=' + row.people_status + ']').prop('checked', true)
			let peopleConfig = (row.people_config).split(',')
			let peopleConfigLen = peopleConfig.length
			for (let i = 0; i < peopleConfigLen; i++) {
				$('.message-config[value=' + peopleConfig[i] + ']').prop('checked', true)
			}
		}
	}

	$('.message-config-all').click(() => {
		if ($('.message-config-all').prop('checked')) {
			$('.message-config').prop('checked', true)
		} else {
			$('.message-config').prop('checked', false)
		}
	})

	$('.message-config').click(() => {
		let peopleConfig = []
		$('.message-config:checked').each(function () {
			peopleConfig.push($(this).val())
		})
		console.log(peopleConfig.length)
		if (peopleConfig.length === 0) {
			$('.message-config-all').prop('checked', false)
		} else if (peopleConfig.length === 4) {
			$('.message-config-all').prop('checked', true)
		} else {
			$('.message-config-all').prop('checked', false)
		}
	})

	$('#add-people').click(() => {
		operationType = 1
		getSetFormValue()
	})

	let getFormValue = () => {
		let peopleName = $('.message-name').val()
		let peopleNumber = $('.message-number').val()
		let peopleStatus = $('.people-status:checked').val()
		let peoplePlan = $('.message-plan').val()
		let peopleConfig = []
		$('.message-config:checked').each(function () {
			peopleConfig.push($(this).val())
		})
		let messageData = {
			people_name: peopleName,
			people_number: peopleNumber,
			people_status: peopleStatus,
			people_plan: peoplePlan,
			people_config: peopleConfig.join(','),
		}
		return messageData
	}

	$('#reserve-message-button').click(() => {
		if (operationType) {
			api.manpower.messageConfigManage.insertMessageConfig(JSON.stringify(getFormValue()), (rep) => {
				layer.close(messageDialog)
				if (rep.result === '0') {
					layer.msg(' 添 加 失 败', {
						icon: 2,
						time: 1200,
					})
				} else {
					initializeTable()
					layer.msg(' 添 加 成 功', {
						icon: 1,
						time: 1200,
					})
				}
			})
		} else {
			api.manpower.messageConfigManage.updateMessageConfig(JSON.stringify(getFormValue()), messageId, (rep) => {
				layer.close(messageDialog)
				if (rep.result === '0') {
					layer.msg(' 添 加 失 败', {
						icon: 2,
						time: 1200,
					})
				} else {
					initializeTable()
					layer.msg(' 添 加 成 功', {
						icon: 1,
						time: 1200,
					})
				}
			})
		}

	})

	let initializeTable = () => {
		$('#message-config-table').bootstrapTable('destroy')
		$('#message-config-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'people_name',
				title: '名称'
			}, {
				field: 'people_number',
				title: '号码'
			}, {
				field: 'plan_name',
				title: '计划'
			}, {
				field: 'people_status',
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
				field: 'people_time',
				title: '创建时间'
			}],
			pageNumber: 1,
			pageSize: 12,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'manpower/getMessageConfig',
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfo')).token}
			},
			queryParamsType: 'json',
			queryParams: function (params) {
			},
			onClickRow: function (row) {
				messageId = row.id
				operationType = 0
				getSetFormValue(row)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		})
	}

	$('#delete-people').click(() => {
		let dataOther = $('#message-config-table').bootstrapTable('getSelections', null)
		let dataLen = dataOther.length
		let data = []
		if (dataLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			for (let i = 0; i < dataLen; i++) {
				data.push(dataOther[i].id)
			}
			api.manpower.messageConfigManage.deleteMessageConfig(data.join(','), function (rep) {
				if (rep.result) {
					initializeTable()
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

	initializeTable()

})
