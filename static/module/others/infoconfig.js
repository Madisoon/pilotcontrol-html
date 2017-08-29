/**
 * Created by Msater Zg on 2017/8/9.
 */
/**
 * Created by Msater Zg on 2017/8/8.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	const orderTableComponent = require('../../common/js/orderTableComponent')
	let [userLoginName, otherType] = [window.parent.SYSTEM.user.user_loginname, '']

	$('.type-button').click(function () {
		let otherType = $(this).attr('data-type')
		if (otherType == '2' || otherType == '3') {
			$('.daokong-content').show()
		} else {
			$('.daokong-content').hide()
		}
		$('.order-table').hide()
		$('#order-component-show').show()
		getOtherConfigByType(otherType)
	})

	$('#all-order-show').click(() => {
		$('.order-table').show()
		$('#order-component-show').hide()
	})

	let getOtherConfigByType = (type) => {
		api.manpower.otherConfigManage.getOtherConfigByType(type, (rep) => {
			console.log(rep)
			let typeData = rep.data
			let dom = []
			for (typeItem of typeData) {
				dom.push('<option data-limit="' + typeItem.other_limit + '" ' +
					'data-mark="' + typeItem.other_mark + '"  data-example = "' + typeItem.other_example + '" ' +
					'value="' + typeItem.id + '">' + typeItem.other_site + '</option>')
			}
			$('#other-type-option').empty()
			$('#other-type-option').append(dom)
			$('#other-type-option').trigger('change')
		})
	}

	getOtherConfigByType('1')

	$('body').on('change', '#other-type-option', function () {
		otherType = $('#other-type-option').val()
		let otherLimit = $('#other-type-option > option:selected').attr('data-limit')
		let otherMark = $('#other-type-option > option:selected').attr('data-mark')
		let otherExample = $('#other-type-option > option:selected').attr('data-example')
		let dom = '<div class="form-group"><label class="col-sm-2 control-label">本次数量:</label>' +
			' <div class="col-sm-2"><input type="number" min="100" class="form-control al-order-number"\n' +
			' value="0" data-name="本次数量" placeholder="数量"></div>' +
			' <div class="col-sm-3"><label class="col-sm-8 control-label">单个分值:</label> <span' +
			' style="color: red;" class="col-sm-4 al-single-number" data-mark="' + otherMark + '">' + otherMark + '分</span></div>' +
			' <div class="col-sm-3"><label class="col-sm-8 control-label"> 最少数量:</label> <span' +
			' style="color: red;" class="col-sm-4 al-limit-number" data-number="' + otherLimit + '">' + otherLimit + '</span>' +
			' </div>' +
			' </div>'
		$('.custom-mark-content').empty()
		$('.custom-mark-content').append(dom)
		$('.form-control.al-order-number').change(function () {
			// 输入框移除事件
			let markTotal = 0
			$('.custom-mark-content .form-group').each(function () {
				let number = parseInt($(this).find('.al-order-number').val(), 10)
				let numberLimit = parseInt($(this).find('.al-limit-number').attr('data-number'), 10)
				if (number < numberLimit) {
					number = numberLimit
					$(this).find('.al-order-number').val(numberLimit)
				}
				let singleMark = parseInt($(this).find('.al-single-number').attr('data-mark'), 10)
				markTotal += parseInt(number * singleMark, 10)
			})
			$('.al-order-total-number').text(markTotal)
		})
	})

	$('.mode-execution').click(() => {
		$('.order-plan').stop().slideToggle()
	})

	$('.btn-primary.order-sure-button').click(() => {
		getUserMark(userLoginName, true, '2')
	})

	let getUserMark = (loginName, contextFlag, type) => {
		api.system.userManage.getSysUser(loginName, (rep) => {
			insertManPowerData(rep.user_mark, loginName, contextFlag, type)
		})
	}

	let insertManPowerData = (userMark, loginName, contextFlag, type) => {
		let orderUrl = $('.form-control.al-order-url').val()
		let orderSupplement = $('.form-control.al-order-supplement').val()
		let realMark = parseInt($('.al-order-total-number').text(), 10)
		let markName = []
		let markOrderNumber = []
		let markNumber = []
		$('.custom-mark-content .form-group').each(function () {
			markName.push($(this).find('.al-order-number').attr('data-name'))
			markOrderNumber.push($(this).find('.al-order-number').val())
			markNumber.push($(this).find('.al-single-number').attr('data-mark'))
		})
		let executionMode = $('.mode-execution:checked').val()
		let orderData = {
			task_url: orderUrl,
			task_start_mark: realMark,
			task_name: markName.join(','),
			task_number: markOrderNumber.join(','),
			task_mark: markNumber.join(','),
			task_execution: executionMode,
			task_type: otherType,
			task_create: loginName,
			task_supplement: orderSupplement,
			task_daokong_type: '0'
		}
		if (executionMode === '0') {
			// 手动执行
			orderData.task_execution_context = $('.form-control.execution-content').val()
		}
		if (orderData.task_url === '' || orderData.task_number === '0') {
			layer.msg('信息填写不完整!', {
				time: 1500
			})
		} else {
			if (userMark - realMark > 0) {
				api.manpower.manpowerManage.insertManPower(JSON.stringify(orderData), (rep) => {
					layer.msg('下单成功!', {icon: 1, time: 1000})
				})
			} else {
				layer.msg('抱歉,您的积分不足，无法正常下单!', {
					time: 1500
				})
			}
		}
	}

	let tableData = {
		userName: userLoginName,
		type: '0',
		pilotControlType: '0'
	}

	let getTableData = () => {
		$('#order-component-show').hide()
		$('.order-table').show()
		orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, () => {
		})
	}
	getTableData()

})
