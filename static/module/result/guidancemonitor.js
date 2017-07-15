/**
 * Created by Msater Zg on 2017/6/30.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../../common/js/api');
	const guidanceTypeSpm = require('../../common/js/guidanceType');
	// 1 代表超级管理员
	const [userLoginName, userType] =  [window.parent.SYSTEM.user.user_loginname, window.parent.SYSTEM.userType];
	let configId = [];
	guidanceTypeSpm.guidanceType.writeDom(userLoginName, userType, '#guidance-type-show',(rep) => {
		configId = rep;
	});
	// 导控类型，导控方式
	let [guidanceType, guidanceWays] = ['', '1'];
	api.result.taskManage.getAllMonitor((rep)=>{
		let monitorDom = [];
		for (let repItem of rep) {
			monitorDom.push('<div class="task-create-item">');
			monitorDom.push('<div class="word task-create">'+repItem.user_name+'</div>');
			monitorDom.push('<div class="word task-type">发帖</div>');
			monitorDom.push('<div class="word task-url">' + (repItem.task_url).substring(0,60) + '</div>');
			monitorDom.push('<div class="word corpus-context">' + repItem.context_number + '</div>');
			monitorDom.push('<div class="word task-number">' + repItem.task_number + '</div>');
			monitorDom.push('<div class="word task-time">' + (repItem.task_time).substring(0, 16) + '</div>');
			monitorDom.push('<div class="word task-operate">');
			monitorDom.push('<button type="button" class="btn btn-primary">复制</button>');
			monitorDom.push('<button type="button" class="btn btn-success">完成</button>');
			monitorDom.push('</div>');
			monitorDom.push('</div>');
		}
		$('.bottom-task').empty();
		$('.bottom-task').append(monitorDom.join(''));
	});
});
