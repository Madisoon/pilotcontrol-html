/**
 * Created by Msater Zg on 2017/6/28.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api');
	const guidanceTypeSpm = require('../../common/js/guidanceType');
	let [configId] = [0];
	const [userLoginName, userType] =  [window.parent.SYSTEM.user.user_loginname, window.parent.SYSTEM.userType];
	guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show', (rep) => {
		configId = rep;
	});
	$('#add-order-form').click(()=>{
		layer.open({
			title: ' 舆 情 导 控 ',
			type: 1,
			area: ['70%', '90%'], //宽高
			content: $('#order-form-dialog')
		});
	});

	$('.form-control.guidance-number').change(function () {
		let guidanceNumber = parseInt($(this).val(),10);
		let guidanceIntegration = $('input[name=guidance-type]:checked').attr("data-number");
		$('.form-control.all-total-integration').val(guidanceNumber*guidanceIntegration);
		$('#')
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
				field: 'corpus_number',
				searchable: true,
				title: '编号'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '导控的类型'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '链接'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '总进度'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '执行时间'
			}, {
				field: 'corpus_context',
				searchable: true,
				title: '订单状态'
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
			},
			pagination: true,
			paginationHAlign: 'left',
			paginationDetailHAlign: 'right'
		});
	}
	initializeTable();
});

