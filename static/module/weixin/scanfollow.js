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
	let [userLoginName, type, imageUrl] = [window.parent.SYSTEM.user.user_loginname, '7', '']
	$('#all-order-show').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#all-order-show').addClass('btn-primary')
		$('#order-component-show').hide()
		$('.order-table').show()
	})

	$('#single-add').click(() => {
		$('.order-operation .btn').removeClass('btn-primary')
		$('#single-add').addClass('btn-primary')
		getFormData()
		$('#upload-input-image').val('')
		$('.al-order-total-number').text('0分')
		$('.al-order-supplement').val('')
		$('.execution-content').val('')
		$('.order-plan').hide()
		$('.mode-execution[value=1]').prop('checked', true)
		$('#order-component-show').show()
		$('.order-table').hide()
	})

	let orderData = {
		contentFlag: false, // 判断是否需要内容
		className: 'button-wbdzl',
		titleContent: '微博地址或id',
		exampleContent: 'http://weibo.com/u/1742727537 或者 http:/微博ID：1742727537',
		userLoginName: userLoginName,
		dataType: type,
	}

	let tableData = {
		userName: userLoginName,
		type: type,
		pilotControlType: '1'
	}

	let getTableData = () => {
		$('#order-component-show').hide()
		$('.order-table').show()
		orderTableComponent.orderTableComponent.writeOrderTableDom('#junior-fans-table', tableData, () => {
		})
	}

	let getFormData = () => {
		api.button.buttonManage.getButtonByName(orderData.className, (rep) => {
			let markData = rep.data
			$('.function-hint .content').text(markData.good_explain)
			$('.al-order-supplement-placeholder').text(markData.supplement_explain)
			//
			// 动态改变表格内容
			let markNames = markData.mark_names.split(',')
			let markNamesLen = markNames.length
			let markNumbers = markData.mark_numbers.split(',')
			let markLimits = markData.mark_limits.split(',')
			let markTotal = 0
			let orderDom = []
			for (let i = 0; i < markNamesLen; i++) {
				orderDom.push('<div class="form-group"> ')
				orderDom.push('<label class="col-sm-2 control-label"><span class="must-write-icon">*</span>' + markNames[i] + ':</label> ')
				orderDom.push('<div class="col-sm-2"> ')
				orderDom.push('<input type="number" min="100" class="form-control al-order-number" value="0" data-name="' + markNames[i] + '" placeholder="数量"> ')
				orderDom.push('</div> ')
				orderDom.push('<div class="col-sm-3"> ')
				orderDom.push('<label class="col-sm-8 control-label">单个分值:</label> ')
				orderDom.push('<span style="color: red;" class="col-sm-4 al-single-number" data-mark="' + markNumbers[i] + '">' + markNumbers[i] + '分</span> ')
				orderDom.push('</div> ')
				orderDom.push('<div class="col-sm-3"> ')
				orderDom.push('<label class="col-sm-8 control-label"> 最少数量:</label> ')
				orderDom.push('<span style="color: red;" class="col-sm-4 al-limit-number" data-number="' + markLimits[i] + '">' + markLimits[i] + '</span> ')
				orderDom.push('</div> ')
				orderDom.push('</div> ')
			}
			$('.custom-mark-content').empty()
			$('.custom-mark-content').append(orderDom.join(''))
			$('.form-control.al-order-number').change(function () {
				// 输入框移除事件
				markTotal = 0
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
	}

	getTableData()
	getFormData()
	$('.mode-execution').click(() => {
		$('.order-plan').stop().slideToggle()
	})

	$('#upload-input-image').change(() => {
		uploadImage()
	})

	$('.btn-primary.order-sure-button').click(() => {
		getUserMark(orderData.userLoginName, true, orderData.dataType)
	})

	let uploadImage = () => {
		$('#upload-weixin-image').ajaxSubmit({
			success: function (data) {
				imageUrl = data
				layer.msg('上传成功!', {icon: 1, time: 1000})
			}, error: function (e) {
				layer.msg('上传失败!', {icon: 2, time: 1000})
			}
		})
	}

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
			task_url: imageUrl,
			task_start_mark: realMark,
			task_name: markName.join(','),
			task_number: markOrderNumber.join(','),
			task_mark: markNumber.join(','),
			task_execution: executionMode,
			task_type: type,
			task_create: loginName,
			task_supplement: orderSupplement,
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
					getTableData()
					layer.msg('下单成功!', {icon: 1, time: 1000})
				})
			} else {
				layer.msg('抱歉,您的积分不足，无法正常下单!', {
					time: 1500
				})
			}
		}
	}

})
