/**
 * Created by Msater Zg on 2017/2/6.
 */
define(function (require, exports, module) {
    // 通过 require 引入依赖,加载所需要的js文件
    const api = require('../../common/js/api');
    let addRoleDialog;
    let updateRoleDialog;
    let role_id;
    let role_name;
    /**
     * 获取本系统的所有的角色
     */
    getAllRole();
    function getAllRole() {
        api.system.roleManage.getAllRole(function (rep) {
            if (rep.result === 0) {
                layer.msg(' 数 据 为 空 ！');
                $('.main-context-left .list-group').empty();
            } else {
                let role_data = rep;
                let role_data_len = rep.length;
                let dom = [];
                for (let i = 0; i < role_data_len; i++) {
                    dom.push('<li class="list-group-item" role-name = "' + role_data[i].role_name + '"  role-id = "' + role_data[i].id + '">' + role_data[i].role_name + '<span class="glyphicon glyphicon-trash icon-cursor delete-role icon-red tooltip-show" data-toggle="tooltip" data-placement="left" title="删 除"></span></li>');
                }
                $('.main-context-left .list-group').empty();
                $('.main-context-left .list-group').append(dom.join(''));
                $('.tooltip-show').tooltip();
                $('.main-context-left .list-group .list-group-item').click(function () {
                    $('.main-context-left .list-group .list-group-item').removeClass('activeli');
                    $(this).addClass('activeli');
                    role_id = $(this).attr('role-id');
                    role_name = $(this).attr('role-name');
                    getSingleRole($(this).attr('role-id'));
                    getUserRole($(this).attr('role-id'));
                });
                $('.main-context-left .list-group .list-group-item:first').trigger('click');
                $('.delete-role').unbind('click').click(function () {
                    let $role_id = $(this).parent().attr('role-id');
                    api.system.roleManage.deleteRole($role_id, function (rep) {
                        if (rep.result) {
                            getAllRole();
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

                    /* $.deleteData({
                     id: $role_id,
                     url: '../deleteRole',
                     deleteCallBack: function () {

                     }
                     });*/
                });
            }
        });
    }

    $('#add-role').unbind('click').click(function () {
        addRoleDialog = layer.open({
            title: '添 加 角 色',
            type: 1,
            area: ['30%', '60%'], //宽高
            content: $('#add-role-dialog')
        });
    });
    $('#update-role').unbind('click').click(function () {
        if ($('#update-role-name').val() === '') {
            layer.msg(' 值 不 可 为 空 ');
        } else {
            updateRoleName(role_id, $('#update-role-name').val());
        }
    });

    $('#cancel-update-role').click(function () {
        layer.close(updateRoleDialog);
    });
    $('#cancel-post-role').click(function () {
        layer.close(addRoleDialog);
    });

    $('#open-update-dialog').unbind('click').click(function () {
        $('#update-role-name').val(role_name);
        updateRoleDialog = layer.open({
            title: '修 改 角 色 名 称',
            type: 1,
            area: ['30%', '40%'], //宽高
            content: $('#update-role-dialog')
        });
    });


    $('.module-context .glyphicon-plus').click(function () {
        let dom = [];
        dom.push('<div class="module-context animated zoomIn">');
        dom.push('<input type="text" class="form-control role-name" placeholder="角色名称">');
        dom.push('<div class="operationicon">');
        dom.push('<span class="glyphicon glyphicon-trash span-icon icon-cursor delete-module icon-red"></span>');
        dom.push('</div>');
        dom.push('<div style="clear: both"></div>');
        dom.push('</div>');
        $('#add-role-dialog .context').append(dom.join(''));
        $('.delete-module').click(function () {
            $(this).parent().parent().addClass('animated zoomOut');
            let this_ = this;
            setTimeout(function () {
                $(this_).parent().parent().remove();
            }, 500);
        });
    });
    //弹出框点击事件
    $('#post-role').unbind('click').click(function () {
        let role_name = [];
        $('.role-name').each(function () {
            role_name.push($(this).val());
        });
        insertRole(role_name.join(','));
        layer.close(addRoleDialog);
    });
    /**
     * 根据角色id获取角色的系统权限的信息
     * @param role_id
     */
    function getSingleRole(role_id) {
        api.system.roleManage.getSingleRole(role_id, function (rep) {
            console.log(rep);
            let role_data = rep;
            let role_data_len = rep.length;
            $('.purview-show').empty();
            let dom = [];
            for (let i = 0; i < role_data_len; i++) {
                let role_detail = role_data[i];
                let role_detail_len = role_data[i].length;
                dom.push('<div class="ui vertical segment"><div class="first_menu_show">' + role_detail[0].menu_first_name + ':</div><div>');
                for (let j = 0; j < role_detail_len; j++) {
                    if (role_detail[j].judge_menu_id === undefined) {
                        dom.push(' <span class="label label-danger change-status  span-label first icon-cursor" menu-pid ="' + role_detail[j].menu_pid + '" menu-purview ="0"  menu-id="' + role_detail[j].menu_id + '">' + role_detail[j].menu_name + '&nbsp;&nbsp;<span class="glyphicon glyphicon-remove"></span></span>');
                    } else {
                        dom.push(' <span class="label label-success change-status span-label first icon-cursor" menu-pid ="' + role_detail[j].menu_pid + '"  menu-purview ="1" menu-id="' + role_detail[j].menu_id + '">' + role_detail[j].menu_name + '&nbsp;&nbsp;<span class="glyphicon glyphicon-ok"></span></span>');
                    }

                }
                dom.push('</div></div>');
            }
            $('.purview-show').append(dom.join(''));
            $('.change-status').unbind('click').click(function () {
                changeRole(role_id, $(this).attr('menu-id'), $(this).attr('menu-pid'), $(this).attr('menu-purview'));
                if ($(this).attr('menu-purview') == '0') {
                    $(this).removeClass('label-danger');
                    $(this).addClass('label-success');
                    $(this).find('span').removeClass('glyphicon-remove');
                    $(this).find('span').addClass('glyphicon-ok');
                    $(this).attr('menu-purview', '1');
                } else {
                    $(this).removeClass('label-success');
                    $(this).addClass('label-danger');
                    $(this).find('span').removeClass('glyphicon-ok');
                    $(this).find('span').addClass('glyphicon-remove');
                    $(this).attr('menu-purview', '0');
                }
            });
        });
    }

    /**
     * 改变用户的系统的权限
     * @param role_id
     * @param menu_id
     * @param menu_pid
     * @param menu_purview
     */
    function changeRole(role_id, menu_id, menu_pid, menu_purview) {
        api.system.roleManage.changeRole(role_id, menu_id, menu_pid, menu_purview, function (rep) {
            if (rep.result === 0) {
                layer.msg(' 添 加 失 败', {
                    icon: 2,
                    time: 1200,
                });
            }
        });
    }

    /**
     * 新增一个角色
     * @param role_name
     */
    function insertRole(role_name) {
        api.system.roleManage.insertRole(role_name, function (rep) {
            if (rep.result === 0) {
							layer.msg(' 添 加 失 败', {
								icon: 2,
								time: 1200,
							});
            } else {
							layer.msg(' 添 加 成 功', {
								icon: 1,
								time: 1200,
								success: function (layero, index) {
									getAllRole();
								}
							});
            }
        });
    }

    /**
     * 修改角色的名称
     * @param role_id
     * @param role_name
     */
    function updateRoleName(role_id, role_name) {
        api.system.roleManage.updateRoleName(role_id, role_name, function (rep) {
            if (rep.result === 0) {
							layer.msg(' 修 改 失 败', {
								icon: 2,
								time: 1200,
							});
            } else {
							layer.close(updateRoleDialog)
							layer.msg(' 修 改 成 功', {
								icon: 1,
								time: 1200,
								success: function (layero, index) {
									getAllRole();
								}
							});
            }
        });
    }

    /**
     * 得到和这个角色有关的人
     * @param role_id
     */
    function getUserRole(role_id) {
        api.system.roleManage.getUserRole(role_id, function (rep) {
            if (rep.result === 0) {
							$('.user-number strong').text('0');
            } else {
							let dataLen = rep.length;
							$('.user-number strong').text(dataLen);
            }
        });
    }
});

