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
		alert(configId);
	});
	// 导控类型，导控方式
	let [guidanceType, guidanceWays] = ['', '1'];

});
