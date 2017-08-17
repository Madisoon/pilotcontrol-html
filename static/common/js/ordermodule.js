/**
 * Created by Msater Zg on 2017/8/11.
 */
// 订单推送系统

define(function (require, exports, module) {
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	const api = require('./api')

	let orderModule = (function () {

		let getUserMark = (loginName, contextFlag, success) => {
			api.system.userManage.getSysUser(loginName, (rep) => {
				console.log(rep.user_mark)
				insertManPowerData(rep.user_mark, loginName, contextFlag, success)
			})
		}

		let insertManPowerData = (userMark, loginName, contextFlag, success) => {
			let orderUrl = $('.form-control.al-order-url').val()
			let orderContext = $('.form-control.al-order-context').val()
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

			if (executionMode === 1) {
				// 自动执行
			} else {
				// 手动执行
			}
			let orderData = {
				task_url: orderUrl,
				task_name: markName.join(','),
				task_number: markOrderNumber.join(','),
				task_mark: markNumber.join(','),
				task_execution: executionMode,
				task_execution_context: executionMode,
				task_type: '1',
				task_create: loginName,
				task_supplement: orderSupplement,
			}
			if (contextFlag) {
				orderData.task_context = orderContext
			}
			if (userMark - realMark > 0) {
				api.manpower.manpowerManage.insertManPower(JSON.stringify(orderData), (rep) => {
					success(1)
				})
			} else {
				success(0)
			}

		}

		return {
			writeOrderDom: function (htmlId, orderData, success) {
				let orderData_ = {
					contentFlag: true, // 判断是否需要内容
					className: 'button-faker',
					titleContent: '',
					userLoginName: 'admin',
				}
				let newOrderData = Object.assign(orderData_, orderData)
				let orderDom = []
				api.button.buttonManage.getButtonByName(newOrderData.className, (rep) => {
					let buttonData = rep.data
					orderDom.push('<div id="add-single-order-dialog" class="al-ui-dialog">')
					orderDom.push('<div class="dialog-context">')
					orderDom.push('<div class="function-hint">')
					orderDom.push('<div class="title">产品信息</div>')
					orderDom.push('<p class="content">')
					orderDom.push('' + buttonData.good_explain + ' </p>')
					orderDom.push('</div>')
					orderDom.push('<form class="form-horizontal">')
					orderDom.push('<div class="form-group">')
					orderDom.push('<label class="col-sm-2 control-label">微博地址或id:</label>')
					orderDom.push('<div class="col-sm-10">')
					orderDom.push('<input type="text" class="form-control al-order-url" placeholder="微博地址或id">')
					orderDom.push('</div>')
					orderDom.push('</div>')
					orderDom.push('<div class="form-group">')
					orderDom.push('<label class="col-sm-2 control-label"></label>')
					orderDom.push('<div class="col-sm-10">')
					orderDom.push('<div class="al-order example-word">http://weibo.com/u/1742727537 或者 http:/微博ID：1742727537 </div>')
					orderDom.push('</div>')
					orderDom.push('</div>')
					orderDom.push('<div class="custom-mark-content"> ')
					let markNames = buttonData.mark_names.split(',')
					let markNamesLen = markNames.length
					let markNumbers = buttonData.mark_numbers.split(',')
					let markLimits = buttonData.mark_limits.split(',')
					let markTotal = 0
					for (let i = 0; i < markNamesLen; i++) {
						orderDom.push('<div class="form-group"> ')
						orderDom.push('<label class="col-sm-2 control-label">' + markNames[i] + ':</label> ')
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
					orderDom.push('</div> ')
					orderDom.push('<div class="form-group">')
					orderDom.push('<label class="col-sm-2 control-label">本次合计:</label>')
					orderDom.push('<span style="color: red;" class="col-sm-10 al-order-total-number">0分</span>')
					orderDom.push('</div>')
					orderDom.push('<div class="form-group">')
					orderDom.push('<label class="col-sm-2 control-label">执行方式:</label>')
					orderDom.push('<div class="col-sm-10">')
					orderDom.push('<label class="radio-inline">')
					orderDom.push('<input type="radio" class="mode-execution" name="mode-execution" value="1" checked="true">')
					orderDom.push('自动执行')
					orderDom.push('</label>')
					orderDom.push('<label class="radio-inline">')
					orderDom.push('<input type="radio" class="mode-execution" name="mode-execution" value="2"> 计划任务')
					orderDom.push('</label>')
					orderDom.push('<div class="order-plan" style="display: none;">')
					orderDom.push('<span>从&nbsp;</span>')
					orderDom.push('<input type="text" style="width: 25%;" class="form-control" placeholder="开始时间">')
					orderDom.push('<span>&nbsp;开始,每天&nbsp;</span>')
					orderDom.push('<select class="form-control" style="width: 8%;">')
					orderDom.push('<option>0</option>')
					orderDom.push('</select>')
					orderDom.push('<span>&nbsp;点增加&nbsp;</span>')
					orderDom.push('<input type="number" style="width: 13%;" class="form-control" placeholder="数量">')
					orderDom.push('</div>')
					orderDom.push('</div>')
					orderDom.push('</div>')
					if (newOrderData.contentFlag) {
						orderDom.push('<div class="form-group">')
						orderDom.push('<label class="col-sm-2 control-label">执行内容:</label>')
						orderDom.push('<div class="col-sm-10">')
						orderDom.push('<label class="radio-inline">')
						orderDom.push('<input type="radio" name="inlineRadioOptions" value="1" checked="true"> 指定内容')
						orderDom.push('</label>')
						orderDom.push('<label class="radio-inline">')
						orderDom.push('<input type="radio" name="inlineRadioOptions" value="2"> 自动内容')
						orderDom.push('</label>')
						orderDom.push('<label class="radio-inline">')
						orderDom.push('<input type="radio" name="inlineRadioOptions" value="2"> 关键词')
						orderDom.push('</label>')
						orderDom.push('<label class="radio-inline">')
						orderDom.push('<input type="radio" name="inlineRadioOptions" value="2"> 关闭内容')
						orderDom.push('</label>')
						orderDom.push('<textarea class="form-control al-order-context" rows="3"></textarea>')
						orderDom.push('</div>')
						orderDom.push('</div>')
					}
					orderDom.push('<div class="form-group">')
					orderDom.push('<label class="col-sm-2 control-label">补充说明:</label>')
					orderDom.push('<div class="col-sm-7">')
					orderDom.push('<textarea class="form-control al-order-supplement" rows="3"></textarea>')
					orderDom.push('</div>')
					orderDom.push('<div class="col-sm-3">')
					orderDom.push('<p>' + buttonData.supplement_explain + '</p>')
					orderDom.push('</div>')
					orderDom.push('</div>')
					orderDom.push('</form>')
					orderDom.push('<div></div>')
					orderDom.push('</div>')
					orderDom.push('<div class="absolute-dialog-action">')
					orderDom.push('<button type="button" class="btn btn-primary order-sure-button">确定</button>')
					orderDom.push('</div>')
					orderDom.push('</div>')

					$(htmlId).empty()
					$(htmlId).append(orderDom.join(''))

					$('.form-control.al-order-number').change(() => {
						markTotal = 0
						$('.custom-mark-content .form-group').each(function () {
							let number = $(this).find('.al-order-number').val()
							let singleMark = $(this).find('.al-single-number').attr('data-mark')
							markTotal += parseInt(parseInt(number, 10) * parseInt(singleMark, 10), 10)
						})
						$('.al-order-total-number').text(markTotal)
					})

					$('.mode-execution').click(() => {
						$('.order-plan').stop().slideToggle()
					})

					$('.btn-primary.order-sure-button').click(() => {
						getUserMark('admin', true, success)
					})

				})
			},
			/*			getOrderForm: function () {
							let orderUrl = $('.form-control.al-order-url').val()
							let orderContext = $('.form-control.al-order-context').val()
							let orderSupplement = $('.form-control.al-order-supplement').val()
							let markName = []
							let markOrderNumber = []
							let markNumber = []
							$('.custom-mark-content .form-group').each(function () {
								markName.push($(this).find('.al-order-number').attr('data-name'))
								markOrderNumber.push($(this).find('.al-order-number').val())
								markNumber.push($(this).find('.al-single-number').attr('data-mark'))
							})
							let executionMode = $('.mode-execution:checked').val()

							if (executionMode === 1) {
								// 自动执行
							} else {
								// 手动执行
							}
							let orderData = {
								task_url: orderUrl,
								task_name: markName.join(','),
								task_number: markOrderNumber.join(','),
								task_mark: markNumber.join(','),
								/!*task_context: orderContext,*!/
								task_execution: executionMode,
								task_execution_context: executionMode,
								task_type: '1',
								task_create: '1',
								task_supplement: orderSupplement,
							}
							return orderData
						}*/
		}
	}())
	return {
		orderModule: orderModule
	}
})