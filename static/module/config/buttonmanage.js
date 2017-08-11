/**
 * Created by Msater Zg on 2017/8/11.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let [addButtonDialog, addMarkDialog] = [{}, {}]
	$('#add-button-type').click(() => {
		addButtonDialog = layer.open({
			title: '新增账号',
			type: 1,
			area: ['60%', '80%'], //宽高
			content: $('#add-button-dialog')
		})

	})

	$('.icon-cursor.add-mark').click(() => {
		addMarkDialog = layer.open({
			title: '新增账号',
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

	$('.reserve-button').click(() => {
		let markData = []
		$('.list-group-item .word').each(function () {
			let mark = {
				mark_name: $(this).attr('data-name'),
				mark_number: $(this).attr('data-number'),
				mark_limit: $(this).attr('data-limit')
			}
			markData.push(mark)
		})




	})
})
