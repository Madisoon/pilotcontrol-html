/**
 * Created by Msater Zg on 2017/1/6.
 */
define(function (require, exports, module) {
	// 立即执行函数实现模块化
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	const baseUrl = 'http://127.0.0.1:8022/'
	/*const baseUrl = 'http://121.199.4.149:8011/'*/
	const getDataWay = function (url, params, httpType, success) {
		//发送ajax请求
		$.ajax({
			url: url,
			type: httpType,
			dataType: 'JSON',
			data: params,
			beforeSend: function (request) {
				request.setRequestHeader('webToken', JSON.parse(localStorage.getItem('sysInfoControl')).token)
			},
			success: function (rep) {
				success(rep)
			},
			error: function () {
			},
		})
	}
	//客户相关的所有的接口
	// 自行执行函数
	const config = (function () {
		let url = baseUrl
		return {
			customerManage: { //客户管理
				changeCustomer: function (customerInfo, customerId, success) {
					getDataWay(url + 'changeCustomer', {
						customerInfo: customerInfo,
						customerId: customerId
					}, success)
				}
			}
		}
	}())

	const corpus = (function () {
		let url = baseUrl + 'corpus/'
		return {
			corpusManage: {
				insertCorpus: function (corpusName, corpusId, corpusType, createUser, success) {
					getDataWay(url + 'insertCorpus', {
						corpusName: corpusName,
						corpusId: corpusId,
						corpusType: corpusType,
						createUser: createUser
					}, 'PUT', success)
				},
				deleteCorpus: function (corpusId, success) {
					getDataWay(url + 'deleteCorpus', {corpusId: corpusId}, 'POST', success)
				},
				updateCorpus: function (corpusId, corpusName, success) {
					getDataWay(url + 'updateCorpus', {
						corpusId: corpusId,
						corpusName: corpusName
					}, 'POST', success)
				},
				getCorpusByUserName: function (userName, corpusType, success) {
					getDataWay(url + 'getCorpusByUserName', {
						userName: userName,
						corpusType: corpusType
					}, 'GET', success)
				},
				getCorpusByAuthority: function (userName, success) {
					getDataWay(url + 'getCorpusByAuthority', {
						userName: userName
					}, 'GET', success)
				}
			},
			corpusContextManage: {
				insertCorpusContext: function (corpusId, corpusContextNumber, corpusContext, success) {
					getDataWay(url + 'insertCorpusContext', {
						corpusId: corpusId,
						corpusContextNumber: corpusContextNumber,
						corpusContext: corpusContext
					}, 'PUT', success)
				},
				deleteCorpusContext: function (corpusContextNumber, success) {
					getDataWay(url + 'deleteCorpusContext', {
						corpusContextNumber: corpusContextNumber
					}, 'POST', success)
				},
				updateCorpusContext: function (corpusContextNumber, corpusContext, success) {
					getDataWay(url + 'updateCorpusContext', {
						corpusContextNumber: corpusContextNumber,
						corpusContext: corpusContext
					}, 'POST', success)
				}
			}
		}
	}())

	const guidance = (function () {
		let url = baseUrl
		return {
			customerManage: { //客户管理
				changeCustomer: function (customerInfo, customerId, success) {
					getDataWay(url + 'changeCustomer', {
						customerInfo: customerInfo,
						customerId: customerId
					}, success)
				}
			}
		}
	}())
	const result = (function () {
		let url = baseUrl + 'guidance/'
		return {
			taskManage: { // 客户管理
				insertTask: function (taskInfo, taskContext, success) {
					getDataWay(url + 'insertTask', {
						taskInfo: taskInfo,
						taskContext: taskContext
					}, 'PUT', success)
				},
				deleteTask: function (taskId, success) {
					getDataWay(url + 'deleteTaskById', {
						taskId: taskId,
					}, 'POST', success)
				},
				getAllMonitor: function (success) {
					getDataWay(url + 'getAllMonitor', {}, 'GET', success)
				},
				updateMonitorStatus: function (taskId, success) {
					getDataWay(url + 'updateMonitorStatus', {
						taskId: taskId
					}, 'POST', success)
				},
			}
		}
	}())

	const button = (function () {
		let url = baseUrl + 'button/'
		return {
			buttonManage: { // 客户管理
				getButtonByName: function (buttonClass, success) {
					getDataWay(url + 'getButtonByName', {
						buttonClass,
					}, 'GET', success)
				},
				insertButton: function (buttonData, markData, success) {
					getDataWay(url + 'insertButton', {
						buttonData,
						markData
					}, 'PUT', success)
				},
				updateButton: function (buttonData, markData, buttonId, success) {
					getDataWay(url + 'updateButton', {
						buttonData,
						markData,
						buttonId
					}, 'POST', success)
				},
				deleteButton: function (buttonId, success) {
					getDataWay(url + 'deleteButton', {
						buttonId,
					}, 'POST', success)
				},
			}
		}
	}())

	const manpower = (function () {
		let url = baseUrl + 'manpower/'
		return {
			manpowerManage: { // 客户管理
				insertManPower: function (manPowerData, success) {
					getDataWay(url + 'insertManPower', {
						manPowerData,
					}, 'PUT', success)
				},
				changeOrderStatus: function (orderId, orderStatus, success) {
					getDataWay(url + 'changeOrderStatus', {
						orderId,
						orderStatus
					}, 'POST', success)
				},
				updateManPowerData: function (orderId, orderStatus, orderData, success) {
					getDataWay(url + 'updateManPowerData', {
						orderId,
						orderStatus,
						orderData
					}, 'POST', success)
				},
			},
			otherConfigManage: {
				insertOtherConfig: function (otherData, success) {
					getDataWay(url + 'insertOtherConfig', {
						otherData,
					}, 'PUT', success)
				},
				deleteOtherConfig: function (configId, success) {
					getDataWay(url + 'deleteOtherConfig', {
						configId,
					}, 'POST', success)
				},
				updateOtherConfig: function (otherData, otherId, success) {
					getDataWay(url + 'updateOtherConfig', {
						otherData,
						otherId
					}, 'POST', success)
				},
				getOtherConfigByType: function (otherType, success) {
					getDataWay(url + 'getOtherConfigByType', {
						otherType
					}, 'GET', success)
				},
				getOtherInfoById: function (typeId, success) {
					getDataWay(url + 'getOtherInfoById', {
						typeId
					}, 'GET', success)
				}
			},
			messageConfigManage: {
				insertMessageConfig: function (messageData, success) {
					getDataWay(url + 'insertMessageConfig', {
						messageData,
					}, 'PUT', success)
				},
				updateMessageConfig: function (messageData, messageId, success) {
					getDataWay(url + 'updateMessageConfig', {
						messageData,
						messageId
					}, 'POST', success)
				},
				deleteMessageConfig: function (messageId, success) {
					getDataWay(url + 'deleteMessageConfig', {
						messageId,
					}, 'POST', success)
				}
			},
			planManage: {
				addPlan: function (planData, success) {
					getDataWay(url + 'addPlan', {planData: planData}, 'PUT', success)
				},
				deletePlan: function (idData, success) {
					getDataWay(url + 'deletePlan', {idData: idData}, 'PUT', success)
				},
				updatePlan: function (planData, id, success) {
					getDataWay(url + 'updatePlan', {
						planData: planData,
						id: id
					}, 'POST', success)
				},
				getAllPlan: function (success) {
					getDataWay(url + 'getAllPlan', {}, 'POST', success)
				}
			}
		}
	}())

	//系统相关的所有的接口
	//用户管理
	const system = (function () {
		let url = baseUrl + 'system/'
		return {
			userManage: {
				getSysUser: function (userName, success) {
					getDataWay(url + 'getSysUser', {
						userName
					}, 'GET', success)
				},
				insertSysUser: function (userData, userCorpus, userConfig, success) {
					getDataWay(url + 'insertSysUser', {
						userData: userData,
						userCorpus: userCorpus,
						userConfig: userConfig
					}, 'PUT', success)
				},
				updateUser: function (userData, userCorpus, userConfig, success) {
					getDataWay(url + 'updateUser', {
						userData: userData,
						userCorpus: userCorpus,
						userConfig: userConfig
					}, 'POST', success)
				},
				deleteUser: function (userName, success) {
					getDataWay(url + 'deleteUser', {userName: userName}, 'POST', success)
				},
				judgeUser: function (userName, userPassword, success) {
					getDataWay(url + 'judgeUser', {
						userName: userName,
						userPassword: userPassword
					}, 'POST', success)
				},
				getAllUser: function (success) {
					getDataWay(url + 'getAllUser', {}, success)
				}
			},
			roleManage: {
				getAllRole: function (success) {
					getDataWay(url + 'getAllRole', {}, 'GET', success)
				},
				getSingleRole: function (roleId, success) {
					getDataWay(url + 'getSingleRole', {
						roleId: roleId
					}, 'GET', success)
				},
				changeRole: function (roleId, menuId, menuPid, menuPurview, success) {
					getDataWay(url + 'changeRole', {
						roleId: roleId,
						menuId: menuId,
						menuPid: menuPid,
						menuPurview: menuPurview
					}, 'POST', success)
				},
				insertRole: function (roleName, success) {
					getDataWay(url + 'insertRole', {
						roleName: roleName
					}, 'PUT', success)
				},
				getUserRole: function (roleId, success) {
					getDataWay(url + 'getUserRole', {
						roleId: roleId
					}, 'GET', success)
				},
				updateRoleName: function (roleId, roleName, success) {
					getDataWay(url + 'updateRoleName', {
						roleId: roleId,
						roleName: roleName
					}, 'POST', success)
				},
				deleteRole: function (roleId, success) {
					getDataWay(url + 'deleteRole', {
						roleId: roleId
					}, 'POST', success)
				}
			},
			moduleManage: {
				insertModule: function (module_value, module_url, module_id, success) {
					getDataWay(url + 'insertModule', {
						module_value: module_value,
						module_url: module_url,
						module_id: module_id
					}, 'PUT', success)
				},
				getAllModule: function (success) {
					getDataWay(url + 'getAllModule', {}, 'GET', success)
				},
				getAllSecondModule: function (module_id, success) {
					getDataWay(url + 'getAllSecondModule', {
						module_id: module_id
					}, 'GET', success)
				},
				deleteModule: function (module_id, success) {
					getDataWay(url + 'deleteModule', {
						module_id: module_id
					}, 'POST', success)
				},
				updateModuleInfo: function (module_id, module_name, module_content, success) {
					getDataWay(url + 'updateModuleInfo', {
						module_id: module_id,
						module_name: module_name,
						module_content: module_content
					}, 'POST', success)
				}
			},
			configManage: {
				insertConfig: function (configName, configType, configId, success) {
					getDataWay(url + 'insertConfig', {
						configName: configName,
						configType: configType,
						configId: configId
					}, 'PUT', success)
				},
				getAllConfig: function (configId, success) {
					getDataWay(url + 'getAllConfig', {
						configId: configId
					}, 'GET', success)
				},
				deleteConfig: function (configId, success) {
					getDataWay(url + 'deleteConfig', {
						configId: configId
					}, 'POST', success)
				},
				getAllTypeConfig: function (userName, success) {
					getDataWay(url + 'getAllTypeConfig', {userName: userName}, 'GET', success)
				},
				getGuidanceAuthority: function (userName, userType, success) {
					getDataWay(url + 'getGuidanceAuthority', {
						userName: userName,
						userType: userType
					}, 'GET', success)
				},
				updateConfig: function (configId, configName, configType, success) {
					getDataWay(url + 'updateConfig', {
						configId: configId,
						configName: configName,
						configType: configType
					}, 'POST', success)
				}
			},
			numberManage: {
				insertNumber: function (numberInfo, success) {
					getDataWay(url + 'insertNumber', {
						numberInfo: numberInfo
					}, 'PUT', success)
				},
				deleteNumber: function (numberId, success) {
					getDataWay(url + 'deleteNumber', {
						numberId: numberId
					}, 'POST', success)
				},
				updateNumberOpen: function (numberId, success) {
					getDataWay(url + 'updateNumberOpen', {
						numberId: numberId
					}, 'POST', success)
				},
				updateNumber: function (numberInfo, numberId, success) {
					getDataWay(url + 'updateNumber', {
						numberInfo: numberInfo,
						numberId: numberId
					}, 'POST', success)
				}
			}
		}
	}())
	return {
		baseUrl: baseUrl,
		config: config,
		corpus: corpus,
		guidance: guidance,
		result: result,
		system: system,
		button: button,
		manpower: manpower
	}
})