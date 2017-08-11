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
		return {
			writeOrderDom: function (htmlId, orderData, success) {
				let orderData_ = {
					contentFlag: false, // 判断是否需要内容
					className: '',
					titleContent:'',
					exeplam
				}
				let newOrderData = Object.assign(orderData_, orderData)
				let orderDom = []
				api.button.buttonManage.getButtonByClassName(newOrderData.className, (rep) => {

				})
				orderDom.push('<div id="add-single-order-dialog" class="al-ui-dialog">')
				orderDom.push('<div class="dialog-context">')
				orderDom.push('<div class="function-hint">')
				orderDom.push('<div class="title">产品信息</div>')
				orderDom.push('<p class="content">')
				orderDom.push('重复，每一秒的零退，都不曾多余。深邃梦的诱惑，人世几多苍败，醒透了山盟海誓，尽角止息，别离了此生。 </p>')
				orderDom.push('</div>')
				orderDom.push('<form class="form-horizontal">')
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label">微博地址或id:</label>')
				orderDom.push('<div class="col-sm-10">')
				orderDom.push('<input type="text" class="form-control" id="inputEmail3" placeholder="微博地址或id">')
				orderDom.push('</div>')
				orderDom.push('</div>')
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label"></label>')
				orderDom.push('<div class="col-sm-10">')
				orderDom.push('<div class="example-word">http://weibo.com/u/1742727537 或者 http:/微博ID：1742727537 </div>')
				orderDom.push('</div>')
				orderDom.push('</div>')
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label">单个分值:</label>')
				orderDom.push('<span style="color: red;" class="col-sm-2">10分</span>')
				orderDom.push('</div>')
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label">粉丝数量:</label>')
				orderDom.push('<div class="col-sm-2">')
				orderDom.push('<input type="number" min="100" class="form-control" placeholder="数量">')
				orderDom.push('</div>')
				orderDom.push('</div>')
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label">本次合计:</label>')
				orderDom.push('<span style="color: red;" class="col-sm-10">1525分</span>')
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
					orderDom.push('<textarea class="form-control context" rows="3"></textarea>')
					orderDom.push('</div>')
					orderDom.push('</div>')
				}
				orderDom.push('<div class="form-group">')
				orderDom.push('<label class="col-sm-2 control-label">补充说明:</label>')
				orderDom.push('<div class="col-sm-7">')
				orderDom.push('<textarea class="form-control" rows="3"></textarea>')
				orderDom.push('</div>')
				orderDom.push('<div class="col-sm-3">')
				orderDom.push('<p>如有特殊需求，请填写补充说明，服务人员将会根据说明进行特殊处理。</p>')
				orderDom.push('</div>')
				orderDom.push('</div>')
				orderDom.push('</form>')
				orderDom.push('<div></div>')
				orderDom.push('</div>')
				orderDom.push('<div class="absolute-dialog-action">')
				orderDom.push('<button type="button" class="btn btn-primary">取消</button>')
				orderDom.push('<button type="button" class="btn btn-success">确定</button>')
				orderDom.push('</div>')
				orderDom.push('</div>')
				$(htmlId).empty(orderDom.join(''))
				$(htmlId).append(orderDom.join(''))
				return orderDom.join('')
			},
			getOrderForm: function () {

			}
		}
	}())
	return {
		orderModule: orderModule
	}
})