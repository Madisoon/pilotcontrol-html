/**
 * Created by Msater Zg on 2017/6/12.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../static/common/js/api')
	const sysInfo = JSON.parse(localStorage.getItem('sysInfoControl'))
	const sysUser = JSON.parse(localStorage.getItem('sysUserControl'))
	if (sysInfo === null || sysInfo === '') {
		window.location.href = './login.html'
	}
	$('#user-name').text(sysInfo.user.user_loginname)
	SYSTEM = {
		user: sysInfo.user,
		model: sysInfo.module,
		functions: sysInfo.function,
		config: sysInfo.config,
		token: sysInfo.token,
		user: sysInfo.user,
		userType: (sysInfo.user.role_name) === '超级管理员' ? 1 : 0
	}

	api.system.userManage.getSysUser(sysInfo.user.user_loginname, (rep) => {
		$('#user-real-mark').text(rep.user_mark)
	})

	$('#system-info').click(() => {
		$('.person-setting-fixed').stop().fadeToggle()
	})

	$('.person-setting').click(() => {
		$('.user-info-choice').stop().slideToggle()
	})

	let navMenuDom = []
	for (let functionsItem of sysInfo.function) {
		navMenuDom.push('<li class="menu-item"> ')
		navMenuDom.push('<a href="#" class="first-a parent-item"> ')
		navMenuDom.push('<span class="title-icon"> ')
		navMenuDom.push('<svg class="icon" aria-hidden="true"> ')
		navMenuDom.push('<use xlink:href="' + functionsItem[0].menu_parent_attr + '"></use> ')
		navMenuDom.push('</svg> ')
		navMenuDom.push('</span>')
		navMenuDom.push('<span class="menu-item-title">&nbsp;' + functionsItem[0].menu_parent_name + '</span>')
		/*		navMenuDom.push('<span>')
				navMenuDom.push('<svg class="icon" aria-hidden="true">')
				navMenuDom.push('<use class="icon-x" xlink:href="#icon-add1"></use>')
				navMenuDom.push('</svg>')
				navMenuDom.push('</span>')*/
		navMenuDom.push('</a>')
		navMenuDom.push('<ul class="child-second-menu" style="display: none;">')
		for (let singleItem  of functionsItem) {
			navMenuDom.push('<li>')
			navMenuDom.push('<a href="../static/module' + singleItem.menu_content + '" target="contextIframe">' + singleItem.menu_name + '</a>')
			navMenuDom.push('</li>')
		}
		navMenuDom.push('</ul>')
		navMenuDom.push('</li>')
	}
	$('.parent-first-menu').append(navMenuDom.join(''))

	// 采用事件委托
	$('.parent-first-menu').on('click', '.menu-item', function () {
		let iconUrl = $(this).find('.icon-x').attr('xlink:href')
		if (iconUrl === '#icon-add1') {
			$(this).find('.icon-x').attr('xlink:href', '#icon-move')
		} else {
			$(this).find('.icon-x').attr('xlink:href', '#icon-add1')
		}
		$('.menu-item ul').stop().slideUp()
		$('.menu-item').removeClass('active')
		$('.menu-item a').removeClass('active')
		$('.menu-item .title-icon').removeClass('span-active')
		$(this).find('.title-icon').addClass('span-active')
		$(this).addClass('active')
		$(this).find('.first-a').addClass('active')
		$(this).find('ul').stop().slideToggle()
	})
	$('.expand-html').click(function () {
		let navWidth = $('.pilotControl-html-nav .left-nav').width()
		if (navWidth > 0) {
			$('.pilotControl-html-nav .left-nav').animate({width: '0%'}, 'fast')
			$('.pilotControl-html-nav .right-context').animate({width: '100%'}, 'fast')
		} else {
			$('.pilotControl-html-nav .left-nav').animate({width: '180px'}, 'fast')
			$('.pilotControl-html-nav .right-context').animate({width: '85%'}, 'fast')
		}
	})
	$('.child-second-menu a').click(function () {
		$('.child-second-menu a').css('color', 'rgba(255, 255, 255, 0.6)')
		$('#iframe-show').prop('src', $(this).prop('href'));
		$(this).css('color', '#FF6C60')
	})
	$('.child-second-menu a:first').trigger('click')
	$('.menu-item > ul').click(function (event) {
		event.stopPropagation()
	})
	$('#personal-setting').click(() => {
		layer.open({
			title: '个人信息展示',
			type: 1,
			area: ['45%', '60%'], //宽高
			content: $('#person-info-dialog')
		})
		$('.form-control.user-name').val(sysUser.user_loginname)
		$('.form-control.user-nick-name').val(sysUser.user_name)
		$('.form-control.user-phone').val(sysUser.user_phone)
		$('.form-control.user-password').val('')
		$('.form-control.password-sure').val('')
	})

	$('#button-preserve').click(() => {
		let userInfo = {
			user_name: $('.form-control.user-nick-name').val(),
			user_phone: $('.form-control.user-phone').val(),
		}
		let passWord = $('.form-control.user-password').val()
		let passWordSure = $('.form-control.password-sure').val()
		if (passWord !== '' || passWordSure !== '') {
			if (passWord === passWordSure) {
				userInfo.user_password = passWord
				updateUser(userInfo)
			} else {
				layer.msg('密码不一致', {
					time: 1500
				})
			}
		} else {
			updateUser(userInfo)
		}
	})

	let updateUser = (userInfo, userLoginName) => {
		layer.closeAll()
	}
})
