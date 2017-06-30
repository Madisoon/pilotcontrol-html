/**
 * Created by Msater Zg on 2017/6/28.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api');
	const guidanceTypeSpm = require('../../common/js/guidanceType');
	let [configId, corpusChooseDialog, addTaskDialog] = [0, {}, {}];
	const [userLoginName, userType] =  [window.parent.SYSTEM.user.user_loginname, window.parent.SYSTEM.userType];
	guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show', (rep) => {
		configId = rep;
		initializeTable();
	});
	$('#add-order-form').click(()=>{
		initializeForm();
		addTaskDialog = layer.open({
			title: ' 舆 情 导 控 ',
			type: 1,
			area: ['70%', '90%'], //宽高
			content: $('#order-form-dialog')
		});
	});

	let computeIntegration = ()=>{
		let guidanceNumber = parseInt($('.form-control.task-number').val(),10);
		let guidanceIntegration = $('input[name=guidance-type]:checked').attr("data-number");
		$('.form-control.all-total-integration').val(guidanceNumber*guidanceIntegration);
	};

	$('.form-control.task-number').change(() => {
		computeIntegration();
	});

	$('input[name=guidance-type]').click(()=>{
		 computeIntegration();
	});

	$('.guidance-context-class').click(function () {
		let guidanceContextType = $(this).val();
		// 1,2,3,4 分别代表自动内容，制定内容，混合内容，关闭内容
		switch(guidanceContextType){
			case '1':
				$('.form-group.custom-corpus').fadeOut();
				$('.form-group.automatic-corpus').fadeIn();
				break;
			case '2':
				$('.form-group.custom-corpus').fadeIn();
				$('.form-group.automatic-corpus').fadeOut();
				break;
			case '3':
				$('.form-group.custom-corpus').fadeIn();
				$('.form-group.automatic-corpus').fadeIn();
				break;
			case '4':
				$('.form-group.custom-corpus').fadeOut();
				$('.form-group.automatic-corpus').fadeOut();
				break;
			default:
				$('.form-group.custom-corpus').fadeOut();
				$('.form-group.automatic-corpus').fadeOut();
				break;
		}
	});

	let initializeTable = ()=>{
		$('#form-table').bootstrapTable('destroy');
		$('#form-table').bootstrapTable({
			columns: [{
				checkbox: true
			}, {
				field: 'task_type',
				searchable: true,
				title: '导控的类型',
				formatter: (value, row, index) => {
					console.log(value);
					let returnValue = '';
					switch (value){
						case '1':
							returnValue = '发帖'
							break;
						case '2':
							returnValue = '回帖'
							break;
						case '0':
							returnValue = '浏览帖子'
							break;
						default:
							returnValue = '格式错误'
							break;
					}
					return returnValue;
				}
			}, {
				field: 'task_url',
				searchable: true,
				title: '链接'
			}, {
				field: 'task_number',
				searchable: true,
				title: '总进度'
			}, {
				field: 'task_time',
				searchable: true,
				title: '执行时间'
			}, {
				field: 'task_integration',
				searchable: true,
				title: '所需积分'
			}, {
				field: 'task_status',
				searchable: true,
				title: '订单状态',
				formatter: (value, row, index) => {
					return value === 0?'完成':'进行中';
				}
			}, {
				field: 'user_name',
				searchable: true,
				title: '创建者'
			}],
			pageNumber: 1,
			pageSize: 20,
			sidePagination: 'client',
			dataField: 'data',//指定后台的数据的名称
			undefinedText: '--',
			classes: 'table table-bordered table-hover',
			method: 'POST',
			formatSearch: function () {
				return '任意搜索'
			},
			url: '' + api.baseUrl + 'guidance/getAllTaskByConfig',
			queryParamsType: "json",
			queryParams: function (params) {
				var param = {
					configId: configId,
					userName: userLoginName
				};
				return JSON.stringify(param);
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		});
	}

	$('#add-corpus').click(function () {
		corpusChooseDialog = layer.open({
			title: ' 选 择 语 料 ',
			type: 1,
			area: ['70%', '80%'],
			content: $('#choose-corpus-dialog'),
			zIndex: layer.zIndex,
			success: function (layero) {
				layer.setTop(layero);
			}
		});
	});




	let initializeCorpusTable = ()=>{
		$('#corpus-context-table').bootstrapTable('destroy');
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
			formatSearch: function () {
				return '任意搜索'
			},
			url: '' + api.baseUrl + 'corpus/getAllCorpusContext',
			queryParamsType: "json",
			queryParams: function (params) {
				var param = {
					pageNumber: params.pageNumber,
					pageSize: params.pageSize,
					corpusId: corpusIdGroup.join(',')
				};
				return JSON.stringify(param);
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		});
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
				name: "corpus_name"
			}
		}
	};

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
				name: "corpus_name"
			}
		}
	};

	// 联动性参数设置
	let zNodesPublic = null;
	let [zNodes, zTree, rMenu] = [[], {}, {}];
	let initializeZtree  = ()=>{
		api.corpus.corpusManage.getCorpusByUserName(userLoginName, userType ,function (rep) {
			zNodes = rep;
			$.fn.zTree.init($('#treeDemo'), setting, zNodes);
			zTree = $.fn.zTree.getZTreeObj('treeDemo');
			if (userType === 0) {
				api.corpus.corpusManage.getCorpusByAuthority(userLoginName ,function (rep) {
					zNodesPublic = rep;
					$.fn.zTree.init($('#public-corpus'), settingPublic, zNodesPublic);
				});
			}else{
				$('.corpus-show.system').remove();
			}
			if(rep.length!==0){
				corpusId = rep[0].id;
				let node = zTree.getNodeByParam('id', corpusId);//获取id为1的点
				zTree.selectNode(node);//选择点
				zTree.setting.callback.onClick(null, zTree.setting.treeId, node);//调用事件
			}
		});
	};
	initializeZtree ();


	function onClickCallBack(event, treeId, treeNode) {
		var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		var nodes = treeObj.transformToArray(treeNode);
		corpusId = treeNode.id;
		var nodesLen = nodes.length;
		var corpusIds = [];
		for (var i = 0; i < nodesLen; i++) {
			corpusIds.push(nodes[i].id);
		}
		corpusIdGroup = corpusIds;
		initializeCorpusTable();
		if (userType === 0) {
			let treeObjPublicS = $.fn.zTree.getZTreeObj("public-corpus");
			treeObjPublicS.cancelSelectedNode();
		}
	};


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
		api.system.areaManage.deleteArea(idS.join(','), (rep)=>{

		});
	}

	function onClickCallBackPublic(event, treeId, treeNode) {
		let treeObjPublic = $.fn.zTree.getZTreeObj("public-corpus");
		let nodes = treeObjPublic.transformToArray(treeNode);
		let nodesLen = nodes.length;
		let corpusIds = [];
		for (let i = 0; i < nodesLen; i++) {
			corpusIds.push(nodes[i].id);
		}
		corpusIdGroup = corpusIds;
		initializeCorpusTable();
		let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		treeObj.cancelSelectedNode();
	}

	$('#reserve-corpus-button').click(()=>{
		// 获取语料的信息
		layer.close(corpusChooseDialog);
		let dataCorpus = $('#corpus-context-table').bootstrapTable('getSelections', null);
		let dataCorpusLen = dataCorpus.length;
		if (dataCorpusLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ');
		} else {
			let corpusDom = [];
			for (data of dataCorpus) {
					corpusDom.push('<span class="label label-primary corpus-icon icon-cursor icon-margin">'+data.corpus_context+'');
					corpusDom.push('&nbsp;&nbsp;<span class="glyphicon  glyphicon-remove "></span>');
					corpusDom.push('</span>');
			}
			$('.guidance-corpus-show').empty();
			$('.guidance-corpus-show').append(corpusDom.join(''));
		}
	});

	$('#cancel-corpus-button').click(() => {
		layer.close(corpusChooseDialog);
	});


	let getFormValue = ()=>{
		let taskUrl = $('.form-control.task-url').val(); // 导控地址
		let taskContext = '';// 导控内容
		let taskNumber = $('.form-control.task-number').val();// 导控的数量
		let numberType = [];// 账号的类型
		$('input[name=number-type]:checked').each(function () {
			numberType.push($(this).val());
		});
		let taskInterval = $('.form-control.task-interval').val();// 导控的间隔
		let taskType = $('input[name=guidance-type]:checked').val();// 导控的类型
		let taskIntegration = $('.form-control.all-total-integration').val();// 导控的积分



		let guidanceContextType = $('.guidance-context-class:checked').val();
		// 1,2,3,4 分别代表自动内容，制定内容，混合内容，关闭内容
		let customContextAll = $('.form-control.custom-context').val();
		let customContext = customContextAll.split('\n');
		let systemContext = [];
		$('.guidance-corpus-show .label-primary').each(function () {
			systemContext.push($(this).text());
		});
		let corpusType = 0;
		switch(guidanceContextType){
			case '1':
				// 只获取自动的内容
				taskContext = systemContext;
				corpusType = 1;
				break;
			case '2':
				// 只获取定制的内容
				taskContext = customContext;
				corpusType = 1;
				break;
			case '3':
				// 只获取混合的内容
				taskContext = [...customContext, ...systemContext];
				corpusType = 1;
				break;
			case '4':
				// 不获取任何内容
				taskContext = [];
				corpusType = 0;
				break;
			default:
				taskContext = [];
				break;
		}

		let guidanceContext = {
			config_id: configId,
			task_corpus_type: corpusType,
			task_url: taskUrl,
			number_type: numberType.join(','),
			interval_time: taskInterval,
			task_type: taskType,
			task_number: taskNumber,
			task_integration: taskIntegration,
			task_create: userLoginName
		};
		return [taskContext, guidanceContext];
	}
	$('#reserve-task-button').click(()=>{
		let [taskContext, taskInfo] = getFormValue();
    api.result.taskManage.insertTask(JSON.stringify(taskInfo), taskContext.join(','), (rep)=>{
    	layer.close(addTaskDialog);
			initializeTable();
			if (rep.result) {
				layer.msg(' 删 除 成 功 ', {
					icon: 1,
					time: 1200,
				});
			} else {
				layer.msg(' 删 除 失 败 ', {
					icon: 2,
					time: 1200,
				});
			}
		});
	});

	let initializeForm = ()=>{
		 $('.form-control.task-url').val(""); // 导控地址
		 $('.form-control.task-number').val("");// 导控的数量
		 $('.form-control.task-interval').val("");// 导控的间隔
		 $('.form-control.all-total-integration').val("");// 导控的积分
		 $('.form-control.custom-context').val("");// 导控的语料内容
		 $('.guidance-corpus-show').empty();
	};



});

