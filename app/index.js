/**
 * Created by Msater Zg on 2017/6/12.
 */
define(function (require, exports, module) {
	// 通过 require 引入依赖,加载所需要的js文件
	const api = require('../static/common/js/api')
	const sysInfo = JSON.parse(localStorage.getItem('sysInfo'))
	const sysUser = JSON.parse(localStorage.getItem('sysUser'))
	if (sysInfo === null || sysInfo === '') {
		window.location.href = './login.html'
	}

	SYSTEM = {
		user: sysInfo.user,
		model: sysInfo.module,
		functions: sysInfo.function,
		config: sysInfo.config,
		token: sysInfo.token,
		user: sysInfo.user,
		userType: (sysInfo.user.role_name) === '超级管理员' ? 1 : 0
	}

	console.log(JSON.parse(localStorage.getItem('sysInfo')).token)

	$('#system-info').click(() => {
		$('.person-setting-fixed').stop().fadeToggle()
	})

	$('.info-show').click(() => {
		$('.user-info-choice').stop().slideToggle()
	})

	let navMenuDom = []
	for (let functionsItem of sysInfo.function) {
		navMenuDom.push('<li class="menu-item"> ')
		navMenuDom.push('<a href="#" class="parent-item"> ')
		navMenuDom.push('<span class="title-icon"> ')
		navMenuDom.push('<svg class="icon" aria-hidden="true"> ')
		navMenuDom.push('<use xlink:href="' + functionsItem[0].menu_parent_attr + '"></use> ')
		navMenuDom.push('</svg> ')
		navMenuDom.push('</span>')
		navMenuDom.push('<span class="menu-item-title">&nbsp; ' + functionsItem[0].menu_parent_name + '</span>')
		navMenuDom.push('<span>')
		navMenuDom.push('<svg class="icon" aria-hidden="true">')
		navMenuDom.push('<use class="icon-x" xlink:href="#icon-add1"></use>')
		navMenuDom.push('</svg>')
		navMenuDom.push('</span>')
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
	$('.menu-item').click(function () {
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
		$(this).find('ul').stop().slideToggle()
	})
	$('.expand-html').click(function () {
		let navWidth = $('.pilotControl-html-nav .left-nav').width()
		if (navWidth > 0) {
			$('.pilotControl-html-nav .left-nav').animate({width: '0%'}, 'fast')
			$('.pilotControl-html-nav .right-context').animate({width: '100%'}, 'fast')
		} else {
			$('.pilotControl-html-nav .left-nav').animate({width: '15%'}, 'fast')
			$('.pilotControl-html-nav .right-context').animate({width: '85%'}, 'fast')
		}
	})
	$('.child-second-menu a').click(function () {
		$('.child-second-menu a').css('color', 'rgba(255, 255, 255, 0.6)')
		$(this).css('color', '#9575cd')
	})
	$('.menu-item > ul').click(function (event) {
		event.stopPropagation()
	})
})
