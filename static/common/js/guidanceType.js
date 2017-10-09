/**
 * Created by Msater Zg on 2017/6/13.
 */
// 导控类型插件

define(function (require, exports, module) {
	// 通过 require 引入依赖
	/* require('http://localhost:63343/service-html/spm_modules/layer/layer.js');*/
	//地址，参数（为对象），方法请求成功
	const api = require('./api')
	let guidanceType = (function () {
		return {
			writeDom: function (userName, userType, htmlId, success) {
				let configDom = []
				api.system.configManage.getGuidanceAuthority(userName, userType, (rep) => {
					console.log(rep)
					configDom.push('<ul class="guidance-show">')
					for (let configItem of rep) {
						configDom.push('<li class="guidance-type-item">')
						configDom.push('<div class="title">' + configItem[0].config_parent_name + '</div>')
						configDom.push('<ul>')
						for (let configContextItem of configItem) {
							configDom.push('<li class="context" gudidance-name="' + configContextItem.config_parent_name + '" guidance-id="' + configContextItem.id + '">' + configContextItem.config_name + '</li>')
						}
						configDom.push('</ul>')
						configDom.push('</li>')
					}
					configDom.push('</ul>')
					$(htmlId).append(configDom.join(''))
					$('.guidance-type-item .context').unbind('click').click(function () {
						$('.guidance-type-item .context').removeClass('active')
						$(this).addClass('active')
						let configId = $(this).attr('guidance-id')
						let configName = $(this).attr('gudidance-name')
						success(configId, configName)
					})
					$('.guidance-type-item .context:first').trigger('click')
				})
			}
		}
	}())
	return {
		guidanceType: guidanceType
	}
})