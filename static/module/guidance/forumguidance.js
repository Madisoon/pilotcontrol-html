/**
 * Created by Msater Zg on 2017/6/12.
 */
/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api');
	const guidanceTypeSpm = require('../../common/js/guidanceType');
	// 1 代表超级管理员
	const [userLoginName, userType] =  [window.parent.SYSTEM.user.user_loginname, window.parent.SYSTEM.userType];
	guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show',(rep) => {
		console.log(rep);
	});
	// 导控类型，导控方式
	let [guidanceType, guidanceWays] = ['', '1'];

	$('.guidance-type-item .context').unbind('click').click(function () {
		$('.guidance-type-item .context').removeClass('active');
		$(this).addClass('active');
		guidanceType = $(this).attr('guidance-id');
	});

	$('.tab-forum .tab a').unbind('click').click(function () {
		$('.tab-forum .tab a').removeClass('active');
		$(this).addClass('active');
		guidanceWays = $(this).attr('guidance-way');
	});

	let getPostForm = ()=>{
		// 获取发帖表单的值
	};

	let getReplyForm = ()=>{
		// 获取回帖表单的值
	};

	let getBrowseForm = ()=>{
		// 获取浏览帖子的表单的值
	};
	
	$('#add-corpus').click(function () {
		layer.open({
			title: ' 选 择 语 料 ',
			type: 1,
			area: ['60%', '80%'],
			content: $('#choose-corpus-dialog'),
		});
	});




	let [corpusIdGroup, corpusId, addCorpusDialog, flag] = [[1], 0, {}, 0];
	let initializeTable = ()=>{
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
			ajaxOptions: {
				headers: {'webToken': JSON.parse(localStorage.getItem('sysInfo')).token}
			},
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
					console.log(rep);
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
		initializeTable();
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
		initializeTable();
		let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
		treeObj.cancelSelectedNode();
	}
});
