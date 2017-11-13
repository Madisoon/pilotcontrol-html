/**
 * Created by Msater Zg on 2017/6/28.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	const guidanceTypeSpm = require('../../common/js/guidanceType')
	let [configId, corpusChooseDialog, addTaskDialog, daokongType, daokongTypeOrder, sinaRemarkDialog] = [0, {}, {}, 0, 1, {}]
	const [userLoginName, userType] = [window.parent.SYSTEM.user.user_loginname, window.parent.SYSTEM.userType]
	guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show', (rep, configName) => {
		configId = rep
		if (configName === '论坛') {
			daokongTypeOrder = 1
			$('.btn-primary.luntan').show()
			$('.btn-primary.news').hide()
		} else {
			daokongTypeOrder = 0
			$('.btn-primary.luntan').hide()
			$('.btn-primary.news').show()
		}
		initializeTable()
	})
	$('#add-order-form').click(() => {
		initializeForm()
	})
	$('#post-card').click(() => {
		// 发帖
		daokongType = 1
		initializeForm()
		$('.form-group').show()
		$('.form-group.automatic-corpus').hide()
	})
	$('#replay-card').click(() => {
		// 回帖
		daokongType = 2
		initializeForm()
		$('.form-group').show()
		$('.form-group.daokong-title').hide()
		$('.form-group.automatic-corpus').hide()
	})
	$('#look-card').click(() => {
		// 浏览帖子
		daokongType = 0
		initializeForm()
		$('.form-group').show()
		$('.form-group.daokong-title').hide()
		$('.form-group.custom-corpus').hide()
		$('.form-group.automatic-corpus').hide()
		$('.form-group.daokong-content').hide()
		$('.form-group.automatic-corpus').hide()
	})

	$('#post-blog').click(() => {
		// 发帖
		daokongType = 3
		initializeFormBlog()
		$('.form-group.daokong-remark').hide()
		$('.form-group.sina-custom-remark').show()
		$('.form-group.sina-remark').hide()
	})
	$('#replay-blog').click(() => {
		// 回帖
		daokongType = 4
		initializeFormBlog()
		$('.form-group.daokong-remark').show()
		$('.form-group.sina-custom-remark').hide()
		$('.form-group.sina-remark').show()
	})

	$('#sina-add-remark').click(() => {
		sinaRemarkDialog = layer.open({
			title: ' 选 择 评 论 ',
			type: 1,
			area: ['70%', '80%'],
			content: $('#sina-remark-dialog'),
			zIndex: layer.zIndex,
			success: function (layero) {
				layer.setTop(layero)
			}
		})
		let sinaUrl = $('.form-control.sina-task-url').val()
		api.result.taskManage.getSinaRemark(sinaUrl, 'sina', '1', (rep) => {
			console.log(rep)
			let remarkDom = []
			for (dataItem of rep.data) {
				remarkDom.push('<div class="checkbox">')
				remarkDom.push('<label>')
				remarkDom.push('<input type="checkbox" value="' + dataItem.content + '" data-newsid="' + dataItem.newsid + '" data-mid="' + dataItem.mid + '" data-channel="' + dataItem.channel + '" class="all-news-remark">')
				remarkDom.push(dataItem.content)
				remarkDom.push('</label>')
				remarkDom.push('</div>')
			}
			$('.sina-remark-show').empty()
			$('.sina-remark-show').append(remarkDom.join(''))
		})
	})

	$('#remark-button').click(() => {
		layer.close(sinaRemarkDialog)
		let remarkDom = []
		$('.all-news-remark:checked').each(function () {
			let content = $(this).val()
			let newsid = $(this).attr('data-newsid')
			let channel = $(this).attr('data-channel')
			let mid = $(this).attr('data-mid')
			remarkDom.push('<p class="remark-p" data-newsid="' + newsid + '" data-mid="' + mid + '" data-channel="' + channel + '">' + content + '<span class="glyphicon glyphicon-remove remark-remove icon-red icon-cursor"></span> </p>')
		})
		$('.guidance-sina-remark-show').empty()
		$('.guidance-sina-remark-show').append(remarkDom.join(''))
	})

	$('.guidance-sina-remark-show').on('click', '.remark-remove', function () {
		$(this).parent().remove()
	})

	let computeIntegration = () => {
		let guidanceNumber = parseInt($('.form-control.task-number').val(), 10)
		let guidanceIntegration = 0
		switch (daokongType) {
			case 1:
				guidanceIntegration = 5
				break
			case 2:
				guidanceIntegration = 4
				break
			case 0:
				guidanceIntegration = 3
				break
		}
		$('.all-total-integration').html(guidanceNumber * guidanceIntegration)
	}

	$('.form-control.task-number').change(() => {
		computeIntegration()
	})

	$('.form-control.sina-task-number').change(() => {
		let guidanceNumber = parseInt($('.form-control.sina-task-number').val(), 10)
		$('.sina-all-total-integration').html(guidanceNumber * 5)
	})

	$('.guidance-context-class').click(function () {
		let guidanceContextType = $(this).val()
		// 1,2,3,4 分别代表自动内容，制定内容，混合内容，关闭内容
		switch (guidanceContextType) {
			case '1':
				$('.form-group.custom-corpus').fadeOut()
				$('.form-group.automatic-corpus').fadeIn()
				break
			case '2':
				$('.form-group.custom-corpus').fadeIn()
				$('.form-group.automatic-corpus').fadeOut()
				break
			case '3':
				$('.form-group.custom-corpus').fadeIn()
				$('.form-group.automatic-corpus').fadeIn()
				break
			default:
				$('.form-group.custom-corpus').fadeOut()
				$('.form-group.automatic-corpus').fadeOut()
				break
		}
	})

	let initializeTable = () => {
		$('#form-table').bootstrapTable('destroy')
		$('#form-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'task_type',
				searchable: true,
				title: '导控的类型',
				formatter: (value, row, index) => {
					let returnValue = ''
					switch (value) {
						case '1':
							returnValue = '发帖'
							break
						case '2':
							returnValue = '回帖'
							break
						case '0':
							returnValue = '浏览帖子'
							break
						case '3':
							returnValue = '博文评论'
							break
						case '4':
							returnValue = '博文点赞'
							break
						default:
							returnValue = '格式错误'
							break
					}
					return returnValue
				},
				width: 80
			}, {
				field: 'task_url',
				searchable: true,
				title: '链接',
			}/*, {
				field: 'task_number',
				searchable: true,
				title: '总进度'
			}*/, {
				field: 'task_time',
				searchable: true,
				title: '执行时间',
				width: 80,
				formatter: (value, row, index) => {
					return value.substring(0, 16)
				}
			}, {
				field: 'task_integration',
				searchable: true,
				title: '所需积分',
				width: 80
			}, {
				field: 'task_number_success',
				searchable: true,
				title: '订单状态',
				formatter: (value, row, index) => {
					return value + '/' + row.task_number
				},
				width: 80
			}/*, {
				field: 'user_name',
				searchable: true,
				title: '创建者'
			}*/],
			pageNumber: 1,
			pageSize: 10,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'guidance/getAllTaskByConfig',
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfoControl')).token}
			},
			queryParamsType: 'json',
			queryParams: function (params) {
				var param = {
					configId: configId,
					userName: userLoginName
				}
				return JSON.stringify(param)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		})
	}

	$('#add-corpus').click(function () {
		corpusChooseDialog = layer.open({
			title: ' 选 择 语 料 ',
			type: 1,
			area: ['70%', '80%'],
			content: $('#choose-corpus-dialog'),
			zIndex: layer.zIndex,
			success: function (layero) {
				layer.setTop(layero)
			}
		})
	})

	let initializeCorpusTable = () => {
		$('#corpus-context-table').bootstrapTable('destroy')
		$('#corpus-context-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'corpus_number',
				searchable: true,
				title: '编号'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '内容'
			}, {
				field: 'corpus_context_time',
				title: '创建时间'
			}],
			pageNumber: 1,
			pageSize: 20,
			sidePagination: 'server',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			url: '' + api.baseUrl + 'corpus/getAllCorpusContext',
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfoControl')).token}
			},
			queryParamsType: 'json',
			queryParams: function (params) {
				var param = {
					pageNumber: params.pageNumber,
					pageSize: params.pageSize,
					corpusId: corpusIdGroup.join(',')
				}
				return JSON.stringify(param)
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		})
	}
	// 树的初始化设置
	let setting = {
		callback: {
			onClick: onClickCallBack,
		},
		data: {
			simpleData: {
				enable: true,
				idKey: 'id',
				pIdKey: 'corpus_pid',
				rootPId: 0
			},
			key: {
				name: 'corpus_name'
			}
		}
	}

	let settingPublic = {
		callback: {
			onClick: onClickCallBackPublic
		},
		data: {
			simpleData: {
				enable: true,
				idKey: 'id',
				pIdKey: 'corpus_pid',
				rootPId: 0
			},
			key: {
				name: 'corpus_name'
			}
		}
	}

	// 联动性参数设置
	let zNodesPublic = null
	let [zNodes, zTree, rMenu] = [[], {}, {}]
	let initializeZtree = () => {
		api.corpus.corpusManage.getCorpusByUserName(userLoginName, userType, function (rep) {
			zNodes = rep
			$.fn.zTree.init($('#treeDemo'), setting, zNodes)
			zTree = $.fn.zTree.getZTreeObj('treeDemo')
			if (userType === 0) {
				api.corpus.corpusManage.getCorpusByAuthority(userLoginName, function (rep) {
					zNodesPublic = rep
					$.fn.zTree.init($('#public-corpus'), settingPublic, zNodesPublic)
				})
			} else {
				$('.corpus-show.system').remove()
			}
			if (rep.length !== 0) {
				corpusId = rep[0].id
				let node = zTree.getNodeByParam('id', corpusId)//获取id为1的点
				zTree.selectNode(node)//选择点
				zTree.setting.callback.onClick(null, zTree.setting.treeId, node)//调用事件
			}
		})
	}
	initializeZtree()

	function onClickCallBack (event, treeId, treeNode) {
		var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
		var nodes = treeObj.transformToArray(treeNode)
		corpusId = treeNode.id
		var nodesLen = nodes.length
		var corpusIds = []
		for (var i = 0; i < nodesLen; i++) {
			corpusIds.push(nodes[i].id)
		}
		corpusIdGroup = corpusIds
		initializeCorpusTable()
		if (userType === 0) {
			let treeObjPublicS = $.fn.zTree.getZTreeObj('public-corpus')
			treeObjPublicS.cancelSelectedNode()
		}
	}

	function removeTreeNode () {
		hideRMenu()
		let treeObj = $.fn.zTree.getZTreeObj('treeDemo')
		let nodes = zTree.getSelectedNodes()
		let nodeId = treeObj.transformToArray(nodes[0])
		if (nodes && nodes.length > 0) {
			if (nodes[0].children && nodes[0].children.length > 0) {
				zTree.removeNode(nodes[0])
			} else {
				zTree.removeNode(nodes[0])
			}
		}
		let nodeIdLen = nodeId.length
		let idS = []
		for (let i = 0; i < nodeIdLen; i++) {
			idS.push(nodeId[i].id)
		}
		api.system.areaManage.deleteArea(idS.join(','), (rep) => {

		})
	}

	function onClickCallBackPublic (event, treeId, treeNode) {
		let treeObjPublic = $.fn.zTree.getZTreeObj('public-corpus')
		let nodes = treeObjPublic.transformToArray(treeNode)
		let nodesLen = nodes.length
		let corpusIds = []
		for (let i = 0; i < nodesLen; i++) {
			corpusIds.push(nodes[i].id)
		}
		corpusIdGroup = corpusIds
		initializeCorpusTable()
		let treeObj = $.fn.zTree.getZTreeObj('treeDemo')
		treeObj.cancelSelectedNode()
	}

	$('#reserve-corpus-button').click(() => {
		// 获取语料的信息
		layer.close(corpusChooseDialog)
		let dataCorpus = $('#corpus-context-table').bootstrapTable('getSelections', null)
		let dataCorpusLen = dataCorpus.length
		if (dataCorpusLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			let corpusDom = []
			for (data of dataCorpus) {
				corpusDom.push('<p class="corpus-p">' + data.corpus_context + '<span class="glyphicon glyphicon-remove icon-red icon-cursor corpus-context-item"></span> </p>')
			}
			$('.guidance-corpus-show').empty()
			$('.guidance-corpus-show').append(corpusDom.join(''))
		}
	})
	$('#cancel-corpus-button').click(() => {
		layer.close(corpusChooseDialog)
	})

	let getFormValue = () => {
		let taskUrl = $('.form-control.task-url').val() // 导控地址
		let taskTitle = $('.form-control.task-title').val() // 导控地址
		let taskContext = ''// 导控内容
		let taskNumber = $('.form-control.task-number').val()// 导控的数量
		let numberType = []// 账号的类型
		$('input[name=number-type]:checked').each(function () {
			numberType.push($(this).val())
		})
		let taskInterval = $('.form-control.task-interval').val()// 导控的间隔
		/*let taskType = $('input[name=guidance-type]:checked').val()// 导控的类型*/
		let taskIntegration = $('.all-total-integration').html()// 导控的积分

		let guidanceContextType = $('.guidance-context-class:checked').val()
		// 1,2,3,4 分别代表自动内容，制定内容，混合内容，关闭内容
		let customContextAll = $('.form-control.custom-context').val()
		let customContext = customContextAll.split('\n')
		let systemContext = []
		$('.guidance-corpus-show .corpus-p').each(function () {
			systemContext.push($(this).text())
		})
		let corpusType = 0
		switch (guidanceContextType) {
			case '1':
				// 只获取自动的内容
				taskContext = systemContext
				corpusType = 1
				break
			case '2':
				// 只获取定制的内容
				taskContext = customContext
				corpusType = 1
				break
			case '3':
				// 只获取混合的内容
				taskContext = [...customContext, ...systemContext]
				corpusType = 1
				break
			case '4':
				// 不获取任何内容
				taskContext = []
				corpusType = 0
				break
			default:
				taskContext = []
				break
		}

		let guidanceContext = {
			config_id: configId,
			task_corpus_type: corpusType,
			task_url: taskUrl,
			task_title: taskTitle,
			number_type: numberType.join(','),
			interval_time: taskInterval,
			task_type: daokongType,
			task_number: taskNumber,
			task_integration: taskIntegration,
			task_create: userLoginName
		}

		let remarkContent = []
		return [taskContext, guidanceContext, remarkContent]
	}

	let getFormValueSina = () => {
		let taskUrl = $('.form-control.sina-task-url').val() // 导控地址
		let taskTitle = $('.form-control.sina-task-title').val() // 导控地址
		let taskNumber = $('.form-control.sina-task-number').val()// 导控的数量
		let numberType = []// 账号的类型
		$('input[name=sina-number-type]:checked').each(function () {
			numberType.push($(this).val())
		})
		let taskInterval = $('.form-control.sina-task-interval').val()// 导控的间隔
		let taskIntegration = $('.sina-all-total-integration').html()// 导控的积分
		let customContextAll = $('.form-control.sina-custom-context').val()
		let customContext = customContextAll.split('\n')
		let corpusContent = []
		let systemContext = []
		for (let customContextItem of customContext) {
			corpusContent.push(customContextItem)
		}
		$('.guidance-sina-remark-show .remark-p').each(function () {
			let contentObject = {}
			contentObject.content = $(this).text()
			contentObject.newsid = $(this).attr('data-newsid')
			contentObject.mid = $(this).attr('data-mid')
			contentObject.channel = $(this).attr('data-channel')
			systemContext.push(contentObject)
		})
		console.log(systemContext)
		let guidanceContext = {
			config_id: configId,
			task_url: taskUrl,
			task_title: taskTitle,
			number_type: numberType.join(','),
			interval_time: taskInterval,
			task_type: daokongType,
			task_number: taskNumber,
			task_integration: taskIntegration,
			task_create: userLoginName
		}
		return [corpusContent, guidanceContext, systemContext]
	}

	$('#reserve-task-button').click(() => {
		let [taskContext, taskInfo, remarkContent] = getFormValue()
		if (!taskInfo.task_title ||
			!taskInfo.task_url ||
			!taskInfo.interval_time ||
			!taskInfo.task_number ||
			!taskInfo.task_integration) {
			layer.msg('信息填写不完整!', {
				time: 1500
			})
		} else {
			// 全部填写完成之后
			api.system.userManage.getSysUser(userLoginName, (rep) => {
				if (parseInt(rep.user_mark) > parseInt(taskInfo.task_integration)) {
					api.result.taskManage.insertTask(JSON.stringify(taskInfo), taskContext.join(','), JSON.stringify(remarkContent), daokongTypeOrder, (rep) => {
						let realMark = $('#user-real-mark', window.parent.document).text()
						realMark = parseInt(realMark) - parseInt(taskInfo.task_integration)
						$('#user-real-mark', window.parent.document).text(realMark)
						layer.close(addTaskDialog)
						initializeTable()
						if (rep.result) {
							layer.msg(' 新 建 成 功 ', {
								icon: 1,
								time: 1200,
							})
						} else {
							layer.msg(' 新 建 失 败 ', {
								icon: 2,
								time: 1200,
							})
						}
					})
				} else {
					layer.msg('积分不足，无法下单!', {
						time: 1500
					})
				}
			})
		}
	})

	$('#sina-task-btn').click(() => {
		// 数据需要修改
		let [taskContext, taskInfo, remarkContent] = getFormValueSina()
		if (!taskInfo.task_url ||
			!taskInfo.interval_time ||
			!taskInfo.task_number ||
			!taskInfo.task_integration) {
			layer.msg('信息填写不完整!', {
				time: 1500
			})
		} else {
			// 全部填写完成之后
			api.system.userManage.getSysUser(userLoginName, (rep) => {
				if (parseInt(rep.user_mark) > parseInt(taskInfo.task_integration)) {
					api.result.taskManage.insertTask(JSON.stringify(taskInfo), taskContext.join(','), JSON.stringify(remarkContent), daokongTypeOrder, (rep) => {
						let realMark = $('#user-real-mark', window.parent.document).text()
						realMark = parseInt(realMark) - parseInt(taskInfo.task_integration)
						$('#user-real-mark', window.parent.document).text(realMark)
						layer.close(addTaskDialog)
						initializeTable()
						if (rep.result) {
							layer.msg(' 新 建 成 功 ', {
								icon: 1,
								time: 1200,
							})
						} else {
							layer.msg(' 新 建 失 败 ', {
								icon: 2,
								time: 1200,
							})
						}
					})
				} else {
					layer.msg('积分不足，无法下单!', {
						time: 1500
					})
				}
			})
		}
	})

	$('#delete-order-form').click(() => {
		let dataCorpus = $('#form-table').bootstrapTable('getSelections', null)
		let dataCorpusLen = dataCorpus.length
		if (dataCorpusLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			let formId = []
			for (data of dataCorpus) {
				formId.push(data.id)
			}
			api.result.taskManage.deleteTask(formId.join(','), (rep) => {
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

	let initializeForm = () => {
		$('.form-control.task-url').val('') // 导控地址
		$('.form-control.task-title').val('') // 导控地址
		$('.form-control.task-number').val('')// 导控的数量
		$('.form-control.task-interval').val('')// 导控的间隔
		$('.all-total-integration').html('')// 导控的积分
		$('.form-control.custom-context').val('')// 导控的语料内容
		$('.guidance-corpus-show').empty()
		addTaskDialog = layer.open({
			title: ' 舆 情 导 控 ',
			type: 1,
			area: ['70%', '90%'], //宽高
			content: $('#order-form-dialog')
		})
	}

	let initializeFormBlog = () => {
		$('.form-control.sina-task-url').val('') // 导控地址
		$('.form-control.sina-task-number').val('')// 导控的数量
		$('.form-control.sina-task-interval').val('')// 导控的间隔
		$('.form-control.sina-custom-context').val('')
		$('.sina-all-total-integration').html('')// 导控的积分
		$('.guidance-sina-remark-show').empty()
		addTaskDialog = layer.open({
			title: ' 新闻导控 ',
			type: 1,
			area: ['70%', '90%'], //宽高
			content: $('#blog-order-form-dialog')
		})
	}

	$('body').on('click', '.corpus-context-item', function () {
		$(this).parent().remove()
	})
})

