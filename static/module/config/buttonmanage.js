/**
 * Created by Msater Zg on 2017/8/11.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let [addButtonDialog, addMarkDialog, operationType, buttonId] = [{}, {}, 1, '']
	$('#add-button-type').click(() => {
		setGetForm()
	})

	$('.icon-cursor.add-mark').click(() => {
		$('.form-control.mark-name').val('')
		$('.form-control.mark-number').val('')
		$('.form-control.mark-limit').val('')
		addMarkDialog = layer.open({
			title: '新增分数',
			type: 1,
			area: ['40%', '50%'], //宽高
			content: $('#add-mark-dialog')
		})
	})

	$('#add-remark-button').click(() => {
		layer.close(addMarkDialog)
		let markName = $('.form-control.mark-name').val()
		let markNumber = $('.form-control.mark-number').val()
		let markLimit = $('.form-control.mark-limit').val()
		let markDom = []
		markDom.push('<li class="list-group-item">')
		markDom.push('<span class="word" data-name="' + markName + '" data-number="' + markNumber + '" ' +
			'data-limit="' + markLimit + '">' + markName + '--最少' + markLimit + '--单个分值' + markNumber + '</span>')
		markDom.push('<span class="glyphicon glyphicon-remove icon-cursor remove-mark"></span>')
		markDom.push('</li>')
		$('.segment .list-group').append(markDom.join(''))
		// 渲染dom
	})

	$('.segment .list-group').on('click', '.remove-mark', function () {
		$(this).parent().remove()
	})

	$('#reserve-button').click(() => {
		layer.close(addButtonDialog)
		let markData = []
		$('.list-group-item .word').each(function () {
			let mark = {
				mark_name: $(this).attr('data-name'),
				mark_number: $(this).attr('data-number'),
				mark_limit: $(this).attr('data-limit')
			}
			markData.push(mark)
		})
		let buttonData = {
			good_explain: $('.form-control.good-explain').val(),
			supplement_explain: $('.form-control.supplement-explain').val(),
			button_status: $('.radio-inline input:checked').val(),
			button_class: $('.form-control.button-class').val(),
			button_name: $('.form-control.button-name').val(),
		}
		if (operationType) {
			api.button.buttonManage.insertButton(JSON.stringify(buttonData), JSON.stringify(markData), (rep) => {
				if (rep.result === 1) {
					initializeTable()
					layer.msg('新 建 成 功 ！', {
						icon: 1,
						time: 1200,
					})
				} else {
					layer.msg(' 新 建 失 败 ！', {
						icon: 2,
						time: 1200,
					})
				}
			})
		} else {
			api.button.buttonManage.updateButton(JSON.stringify(buttonData), JSON.stringify(markData), buttonId, (rep) => {
				if (rep.result === 1) {
					initializeTable()
					layer.msg('修 改 成 功 ！', {
						icon: 1,
						time: 1200,
					})
				} else {
					layer.msg(' 修 改 失 败 ！', {
						icon: 2,
						time: 1200,
					})
				}
			})
		}
	})

	$('#delete-button-type').on('click', () => {
		let data = $('#button-table').bootstrapTable('getSelections', null)
		let dataLen = data.length
		let dataId = []
		if (dataLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			for (let dataSingle of data) {
				dataId.push(dataSingle.id)
			}
			api.button.buttonManage.deleteButton(dataId.join(','), (rep) => {
				if (rep.result === 1) {
					initializeTable()
					layer.msg(' 删 除 成 功 ！', {
						icon: 1,
						time: 1200,
					})
				} else {
					layer.msg(' 删 除 失 败 ！', {
						icon: 2,
						time: 1200,
					})
				}
			})
		}
	})

	let setGetForm = (row = '') => {
		addButtonDialog = layer.open({
			title: '新增按钮类型',
			type: 1,
			area: ['60%', '80%'], //宽高
			content: $('#add-button-dialog')
		})
		if (row === '') {
			// 清空
			operationType = 1
			$('.segment .list-group').empty()
			$('.form-control.good-explain').val('')
			$('.form-control.supplement-explain').val('')
			$('.form-control.button-class').val('')
			$('.form-control.button-name').val('')
		} else {
			// 赋值
			operationType = 0
			buttonId = row.id
			$('.form-control.good-explain').val(row.good_explain)
			$('.form-control.supplement-explain').val(row.supplement_explain)
			$('.form-control.button-class').val(row.button_class)
			$('.form-control.button-name').val(row.button_name)
			$('.radio-inline input[value=' + row.button_status + ']').prop('checked', true)
			let markNames = row.mark_names.split(',')
			let markNamesLen = markNames.length
			let markNumbers = row.mark_numbers.split(',')
			let markLimits = row.mark_limits.split(',')
			let markDom = []
			for (let i = 0; i < markNamesLen; i++) {
				markDom.push('<li class="list-group-item">')
				markDom.push('<span class="word" data-name="' + markNames[i] + '" data-number="' + markNumbers[i] + '" ' +
					'data-limit="' + markLimits[i] + '">' + markNames[i] + '--最少' + markLimits[i] + '--单个分值' + markNumbers[i] + '</span>')
				markDom.push('<span class="glyphicon glyphicon-remove icon-cursor remove-mark"></span>')
				markDom.push('</li>')
			}
			$('.segment .list-group').empty()
			$('.segment .list-group').append(markDom.join(''))
		}
	}

	let initializeTable = () => {
		$('#button-table').bootstrapTable('destroy')
		$('#button-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'button_name',
				searchable: true,
				title: '配置说明'
			}, {
				field: 'good_explain',
				searchable: true,
				title: '产品说明'
			}, {
				field: 'supplement_explain',
				searchable: true,
				title: '功能说明'
			}, {
				field: 'button_status',
				title: '按钮状态',
				formatter: (value, row, index) => {
					console.log(value)
					if (value === '1') {
						return '可用'
					} else {
						return '<span style="color: red;font-weight: 600">不可用</span>'
					}
				}
			}, {
				field: 'button_class',
				title: '按钮类'
			}, {
				field: 'button_time',
				title: '创建时间'
			}],
			pageNumber: 1,
			pageSize: 9,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'GET',
			url: '' + api.baseUrl + 'button/getAllButton',
			queryParamsType: 'json',
			queryParams: function (params) {

			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right',
			onClickRow: (row) => {
				setGetForm(row)
			}
		})
	}
	initializeTable()

})
