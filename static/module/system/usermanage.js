/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api')
	let customDialog = ''
	let userOperstion

	let [guidanceDialog, corpusDialog, configTreeObj, corpusTreeObj] = [{}, {}, {}, {}]

	$('.cancel-button').on('click', () => {
		layer.closeAll()
	})

	$('#add-guidance').click(() => {
		guidanceDialog = layer.open({
			title: ' 导控权限设置 ',
			type: 1,
			area: ['25%', '80%'], //宽高
			content: $('#choose-guidance-dialog'),
			zIndex: layer.zIndex, //重点1
			success: function (layero) {
				layer.setTop(layero) //重点2
			}
		})
	})
	$('#add-corpus').click(() => {
		corpusDialog = layer.open({
			title: ' 语料权限设置 ',
			type: 1,
			area: ['25%', '80%'], //宽高
			content: $('#choose-corpus-dialog'),
			zIndex: layer.zIndex, //重点1
			success: function (layero) {
				layer.setTop(layero) //重点2
			}
		})
	})

	let initializeTable = () => {
		//初始化表格
		$('#user-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'user_loginname',
				searchable: true,
				sortable: true,
				title: '账号'
			}, {
				field: 'user_name',
				searchable: true,
				title: '姓名'
			}, {
				field: 'user_mark',
				searchable: true,
				title: '个人积分'
			}, {
				field: 'role_name',
				title: '角色'
			}, {
				field: 'user_phone',
				searchable: true,
				title: '手机号'
			}, {
				field: 'config_names',
				searchable: true,
				title: '导控权限'
			}, {
				field: 'corpus_names',
				searchable: true,
				title: '语料权限'
			}, {
				field: 'user_createtime',
				title: '创建时间'
			}],
			pageNumber: 1,
			pageSize: 12,
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'GET',
			formatSearch: function () {
				return '任意搜索'
			},
			url: '' + api.baseUrl + 'system/getAllSysUser',
			queryParamsType: 'undefined',
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right',
			onClickRow: function (row) {
				userOperstion = false
				console.log(row)
				getSingleInfo(row)
			},
			onLoadSuccess: function (data) {
			}
		})
	}
	initializeTable()
	//保存点击事件
	$('#reserve-button').unbind('click').click(function () {
		/* insertSysUser();*/
		let [userData, configData, corpusData] = getFormValue()
		if (userData.user_loginname == '' ||
			userData.user_name == '' ||
			userData.user_phone == '' ||
			userData.user_role == '') {
			layer.msg('抱歉,数据没有填写完整！', {
				time: 1500,
				zIndex: layer.zIndex, //重点1
				success: function (layero) {
					layer.setTop(layero) //重点2
				}
			})
		} else {
			//密码要想等
			if (userOperstion) {
				//插入密码不为空
				if ($('.form-control.user_password').val() == '' || $('.form-control.user_password_sure').val() == '') {
					layer.msg('抱歉,数据没有填写完整！', {
						time: 1500,
						zIndex: layer.zIndex, //重点1
						success: function (layero) {
							layer.setTop(layero) //重点2
						}
					})
				} else {
					if ($('.form-control.user_password').val() != $('.form-control.user_password_sure').val()) {
						layer.msg('抱歉,两次密码不一致！', {
							time: 1500,
							zIndex: layer.zIndex, //重点1
							success: function (layero) {
								layer.setTop(layero) //重点2
							}
						})
					} else {
						userData.user_password = $('.form-control.user_password').val()
						api.system.userManage.insertSysUser(JSON.stringify(userData), corpusData, configData, function (rep) {
							if (rep.result === 1) {
								layer.close(customDialog)
								layer.msg(' 新 增 成 功 ', {
									icon: 1,
									time: 1200,
									success: function () {
										$('#user-table').bootstrapTable('refresh', null)
									}
								})
							} else {
								layer.msg(' 新 增 失 败', {
									icon: 2,
									time: 1200,
								})
							}
						})
					}
				}
			} else {
				//修改密码可以为空
				if ($('.form-control.user_password').val() == '' && $('.form-control.user_password_sure').val() == '') {
					api.system.userManage.updateUser(JSON.stringify(userData), corpusData, configData, function (rep) {
						if (rep.result === 1) {
							layer.close(customDialog)
							layer.msg(' 修 改 成 功 ', {
								icon: 1,
								time: 1200,
								success: function () {
									$('#user-table').bootstrapTable('refresh', null)
								}
							})
						} else {
							layer.msg(' 修 改 失 败', {
								icon: 2,
								time: 1200,
							})
						}
					})
				} else {
					if ($('.form-control.user_password').val() != $('.form-control.user_password_sure').val()) {
						layer.msg('抱歉,两次密码不一致！', {
							time: 1500,
							zIndex: layer.zIndex, //重点1
							success: function (layero) {
								layer.setTop(layero) //重点2
							}
						})
					} else {
						userData.user_password = $('.form-control.user_password').val()
						api.system.userManage.updateUser(JSON.stringify(userData), corpusData, configData, function (rep) {
							if (rep.result == 1) {
								layer.close(customDialog)
								layer.msg(' 修 改 成 功 ', {
									icon: 1,
									time: 1200,
									success: function () {
										$('#user-table').bootstrapTable('refresh', null)
									}
								})
							} else {
								layer.msg(' 修 改 失 败', {
									icon: 2,
									time: 1200,
								})
							}
						})
					}
				}
			}
		}
	})
	//取消点击事件
	$('#cancel-button').unbind('click').click(function () {
		layer.close(customDialog)
	})
	//新增点击事件
	$('#addUserData').unbind('click').click(function () {
		userOperstion = true
		insertOrGetValue(false, '')
		customDialog = layer.open({
			title: ' 用户信息管理 ',
			type: 1,
			area: ['60%', '90%'], //宽高
			content: $('#userInfoDialog')
		})
	})
	$('#deleteUserData').unbind('click').click(function () {
		let dataUser = $('#user-table').bootstrapTable('getSelections', null)
		let dataUserLen = dataUser.length
		let data = []
		if (dataUserLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ')
		} else {
			for (let i = 0; i < dataUserLen; i++) {
				data.push(dataUser[i].user_loginname)
			}
			api.system.userManage.deleteUser(data.join(','), function (rep) {
				if (rep.result) {
					$('#user-table').bootstrapTable('refresh', null)
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

	/**
	 *得到表单的值
	 */


	function getFormValue () {
		let configData = []
		let corpusData = []
		$('.guidance-span-show .label-primary').each(function () {
			configData.push($(this).attr('configId'))
		})
		$('.corpus-span-show .label-primary').each(function () {
			corpusData.push($(this).attr('corpusId'))
		})
		let userData = {
			user_loginname: $('.form-control.user_loginname').val(),
			user_name: $('.form-control.user_name').val(),
			user_phone: $('.form-control.user_phone').val(),
			user_mark: $('.form-control.user_mark').val(),
			user_role: $('.form-control.user_role').val(),
		}
		return [userData, configData.join(','), corpusData.join(',')]
	}

	$('.guidance-span-show').on('click', '.config-icon', function () {
		let configId = $(this).attr('configId')
		$(this).remove()
		let treeObj = $.fn.zTree.getZTreeObj('public-config')
		let node = treeObj.getNodeByParam('id', configId)
		//设置选择状态
		treeObj.selectNode(node)
		//改变被选择的状态
		treeObj.checkNode(node, false, false)
		//更新状态
		treeObj.updateNode(node)

	})

	$('.corpus-span-show').on('click', '.corpus-icon', function () {
		let corpusId = $(this).attr('corpusId')
		$(this).remove()
		let treeObj = $.fn.zTree.getZTreeObj('public-corpus')
		let node = treeObj.getNodeByParam('id', corpusId)
		//设置选择状态
		treeObj.selectNode(node)
		//改变被选择的状态
		treeObj.checkNode(node, false, false)
		//更新状态
		treeObj.updateNode(node)
	})

	/**
	 * 初始化表单的值
	 * @param flag
	 * @param row
	 */
	function insertOrGetValue (flag, row) {
		if (flag) {
			$('.form-control.user_loginname').prop('disabled', true)
			$('.form-control.user_loginname').val(row.user_loginname)
			$('.form-control.user_name').val(row.user_name)
			$('.form-control.user_phone').val(row.user_phone)
			$('.form-control.user_mark').val(row.user_mark)
			$('.form-control.user_dep').val(row.user_dep)
			$('.form-control.user_role').val(row.user_role)
			$('.form-control.user_password').val('')
			$('.form-control.user_password_sure').val('')
			let configNames = row.config_names.split(',')
			let configIds = row.config_ids.split(',')
			let configDom = []
			let corpusDom = []
			for (let [index, elem] of configNames.entries()) {
				configDom.push('<span class="label label-primary config-icon icon-cursor icon-margin" configId="' + configIds[index] + '">')
				configDom.push('' + elem + '&nbsp;&nbsp;')
				configDom.push('<span class="glyphicon  glyphicon-remove "></span>')
				configDom.push('</span>')
				let treeObj = $.fn.zTree.getZTreeObj('public-config')
				let node = treeObj.getNodeByParam('id', configIds[index])
				//设置选择状态
				treeObj.selectNode(node)
				//改变被选择的状态
				treeObj.checkNode(node, true, false)
				//更新状态
				treeObj.updateNode(node)
			}
			let corpusNames = row.corpus_names.split(',')
			let corpusIds = row.corpus_ids.split(',')
			for (let [index, elem] of corpusNames.entries()) {
				corpusDom.push('<span class="label label-primary corpus-icon icon-cursor icon-margin" corpusId="' + corpusIds[index] + '">')
				corpusDom.push('' + elem + '&nbsp;&nbsp;')
				corpusDom.push('<span class="glyphicon  glyphicon-remove "></span>')
				corpusDom.push('</span>')
				let treeObj = $.fn.zTree.getZTreeObj('public-corpus')
				let node = treeObj.getNodeByParam('id', corpusIds[index])
				//设置选择状态
				treeObj.selectNode(node)
				//改变被选择的状态
				treeObj.checkNode(node, true, false)
				//更新状态
				treeObj.updateNode(node)
			}
			$('.guidance-span-show').empty()
			$('.guidance-span-show').append(configDom.join(''))
			$('.corpus-span-show').empty()
			$('.corpus-span-show').append(corpusDom.join(''))
		} else {
			$('.form-control.user_loginname').prop('disabled', false)
			$('.form-control.user_loginname').val('')
			$('.form-control.user_name').val('')
			$('.form-control.user_phone').val('')
			$('.form-control.user_mark').val('')
			$('.form-control.user_password').val('')
			$('.form-control.user_password_sure').val('')
			$('.guidance-span-show').empty()
			$('.corpus-span-show').empty()
		}
	}

	/**
	 * 得到用户的信息
	 * @param row
	 */
	function getSingleInfo (row) {
		insertOrGetValue(true, row)
		customDialog = layer.open({
			title: ' 用户信息管理 ',
			type: 1,
			area: ['60%', '90%'], //宽高
			content: $('#userInfoDialog')
		})
	}

	let setting = {
		check: {
			enable: true,
			chkStyle: 'checkbox',
			chkboxType: {'Y': '', 'N': ''}
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
	let [zNodes, zTree] = [[], {}]
	api.corpus.corpusManage.getCorpusByUserName('', '1', function (rep) {
		zNodes = rep
		$.fn.zTree.init($('#public-corpus'), setting, zNodes)
		corpusTreeObj = $.fn.zTree.getZTreeObj('public-corpus')
	})

	$('#reserve-corpus-button').click(() => {
		let treeObj = $.fn.zTree.getZTreeObj('public-corpus')
		let nodes = treeObj.getCheckedNodes(true)
		let corpusDom = []
		for (let nodesItem of nodes) {
			corpusDom.push('<span class="label label-primary icon-cursor icon-margin" corpusId="' + nodesItem.id + '">')
			corpusDom.push('' + nodesItem.corpus_name + '&nbsp;&nbsp;')
			corpusDom.push('<span class="glyphicon  glyphicon-remove "></span>')
			corpusDom.push('</span>')
		}
		$('.corpus-span-show').empty()
		$('.corpus-span-show').append(corpusDom.join(''))
		layer.close(corpusDialog)
	})

	$('#reserve-guidance-button').click(() => {
		let treeObj = $.fn.zTree.getZTreeObj('public-config')
		let nodes = treeObj.getCheckedNodes(true)
		let configDom = []
		for (let nodesItem of nodes) {
			configDom.push('<span class="label label-primary icon-cursor icon-margin" configId="' + nodesItem.id + '">')
			configDom.push('' + nodesItem.config_name + '&nbsp;&nbsp;')
			configDom.push('<span class="glyphicon  glyphicon-remove "></span>')
			configDom.push('</span>')
		}
		$('.guidance-span-show').empty()
		$('.guidance-span-show').append(configDom.join(''))
		layer.close(guidanceDialog)
	})

	/**
	 * 得到部门和角色信息
	 */
	let settingConfig = {
		check: {
			enable: true,
			chkboxType: {'Y': '', 'N': ''}
		},
		data: {
			simpleData: {
				enable: true,
				idKey: 'id',
				pIdKey: 'config_pid',
				rootPId: 0
			},
			key: {
				name: 'config_name'
			}
		}
	}
	let [zNodesConfig, zTreeConfig] = [[], {}]
	api.system.configManage.getAllTypeConfig('', (rep) => {
		console.log(rep)
		let dataLen = rep.length
		for (let i = 0; i < dataLen; i++) {
			if (rep[i].config_pid === '0') {
				rep[i].nocheck = true
			} else {
				rep[i].nocheck = false
			}
		}
		zNodesConfig = rep
		$.fn.zTree.init($('#public-config'), settingConfig, zNodesConfig)
		configTreeObj = $.fn.zTree.getZTreeObj('public-config')
	})

	api.system.roleManage.getAllRole((rep) => {
		let roleData = rep
		let roleDom = []
		for (let roleItem of roleData) {
			roleDom.push('<option value="' + roleItem.id + '">' + roleItem.role_name + '</option>')
		}
		$('.user_role').append(roleDom.join(''))
	})
})
