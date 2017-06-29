/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api');
	// 1代表超级管理员
	const [userType, userLoginName] = [window.parent.SYSTEM.userType, window.parent.SYSTEM.user.user_loginname];
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
			paginationDetailHAlign: 'right',
			onClickRow: (row) => {
				flag = 0;
				getSetFromValue(row);
			}
		});
	}
	// 树的初始化设置
	let setting = {
		edit: {
			enable: true,
			showRemoveBtn: false,
			showRenameBtn: false
		},
		view: {
			dblClickExpand: false
		},
		callback: {
			onRightClick: OnRightClick,
			onClick: onClickCallBack,
			onRename: zTreeOnRename
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
			rMenu = $('#rMenu');
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
	// 修改名称成功之后的回调
	//
	function zTreeOnRename (event, treeId, treeNode, isCancel) {
		api.corpus.corpusManage.updateCorpus(treeNode.id, treeNode.corpus_name, function (rep) {
		});

	}

	// 右键菜单点击
	function OnRightClick (event, treeId, treeNode) {
		if (!treeNode && event.target.tagName.toLowerCase() !== 'button' && $(event.target).parents('a').length === 0) {
			zTree.cancelSelectedNode()
			showRMenu('root', event.clientX, event.clientY)
		} else if (treeNode && !treeNode.noR) {
			zTree.selectNode(treeNode)
			showRMenu('node', event.clientX, event.clientY)
		}
	}

	function showRMenu (type, x, y) {
		$('#rMenu ul').show()
		if (type === 'root') {
			$('#update-name').hide()
			$('#delete-tag').hide()
		} else {
			$('#update-name').show()
			$('#delete-tag').show()
		}
		rMenu.css({'top': y + 'px', 'left': x + 'px', 'visibility': 'visible'})
		$('body').bind('mousedown', onBodyMouseDown)
	}
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

	function hideRMenu () {
		if (rMenu) rMenu.css({'visibility': 'hidden'})
		$('body').unbind('mousedown', onBodyMouseDown)
	}

	function onBodyMouseDown (event) {
		if (!(event.target.id == 'rMenu' || $(event.target).parents('#rMenu').length > 0)) {
			rMenu.css({'visibility': 'hidden'})
		}
	}

	function addTreeNode () {
		hideRMenu();

		let newNode = null;

		if (zTree.getSelectedNodes()[0]) {
			newNode = {name: '新增标签', corpus_pid: zTree.getSelectedNodes()[0].id, id: '1'}
			zTree.addNodes(zTree.getSelectedNodes()[0], newNode)
		} else {
			newNode = {name: '新增标签', corpus_pid: 0, id: '1'}
			zTree.addNodes(null, newNode)
		}
		api.corpus.corpusManage.insertCorpus(newNode.name, newNode.corpus_pid, userType, userLoginName, function (rep) {
			initializeZtree();
			if (rep.result  === 0) {
				layer.msg(' 添 加 失 败 ！', {
					icon: 2,
					time: 1200,
				})
			} else {
				layer.msg(' 添 加 成 功 ！', {
					icon: 1,
					time: 1200,
				});
			}
		});

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
		api.system.areaManage.deleteArea(idS.join(','), (rep)=>{

		});
	}

	function changeName () {
		hideRMenu()
		let zTree = $.fn.zTree.getZTreeObj('treeDemo'),
			nodes = zTree.getSelectedNodes(),
			treeNode = nodes[0]
		if (nodes.length == 0) {
			alert('请先选择一个节点')
			return
		}
		zTree.editName(treeNode)
	}

	$('#add-tag').unbind('click').click(()=>{
		addTreeNode()
	});

	$('#update-name').unbind('click').click(()=>{
		changeName()
	});

	$('#delete-tag').unbind('click').click(()=>{
		removeTreeNode()
	});

	$('#add-corpus').unbind('click').click(()=>{
		flag = 1;
		getSetFromValue();
	});
    $('#reserve-button').unbind('click').click(()=>{
        let corpusNumber = $('.form-control.add-corpus-number').val();
        let corpusContext = $('.form-control.add-corpus-context').val();
        if (flag) {
					api.corpus.corpusContextManage.insertCorpusContext(corpusId, corpusNumber, corpusContext, (rep)=>{
						initializeTable();
						layer.close(addCorpusDialog);
						if (rep.result  === 0) {
							layer.msg(' 添 加 失 败 ！', {
								icon: 2,
								time: 1200,
							})
						} else {
							layer.msg(' 添 加 成 功 ！', {
								icon: 1,
								time: 1200,
							});
						}
					});
				} else {
					api.corpus.corpusContextManage.updateCorpusContext(corpusNumber, corpusContext, (rep)=>{
						initializeTable();
						layer.close(addCorpusDialog);
						if (rep.result  === 0) {
							layer.msg(' 修 改 失 败 ！', {
								icon: 2,
								time: 1200,
							})
						} else {
							layer.msg(' 修 改 成 功 ！', {
								icon: 1,
								time: 1200,
							});
						}
					});
				}
	});

	$('#delete-corpus').unbind('click').click(()=>{
		let dataCorpus = $('#corpus-context-table').bootstrapTable('getSelections', null);
		let dataCorpusLen = dataCorpus.length;
		let dataId = [];
		if (dataCorpusLen === 0) {
			layer.msg(' 没 有 选 中 任 何 数 据 ');
		} else {
			for (let dataSingle of dataCorpus) {
				dataId.push(dataSingle.corpus_number);
			}
			api.corpus.corpusContextManage.deleteCorpusContext(dataId.join(','), (rep)=> {
				if (rep.result) {
					initializeTable();
					layer.msg(' 删 除 成 功 ！', {
						icon: 1,
						time: 1200,
					});
				} else {
					layer.msg(' 删 除 失 败 ！', {
						icon: 2,
						time: 1200,
					});
				}
			});
		}
	});

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
	
	function getSetFromValue (row = {}) {
		addCorpusDialog = layer.open({
			title: ' 添 加 语 料',
			type: 1,
			area: ['50%', '50%'],
			content: $('#addCorpusDialog'),
		});
		if (flag) {
			$('.form-control.add-corpus-number').prop('disabled', false);
			$('.form-control.add-corpus-number').val('');
			$('.form-control.add-corpus-context').val('');
		} else {
			$('.form-control.add-corpus-number').prop('disabled', true);
			$('.form-control.add-corpus-number').val(row.corpus_number);
			$('.form-control.add-corpus-context').val(row.corpus_context);
		}
	}
});

