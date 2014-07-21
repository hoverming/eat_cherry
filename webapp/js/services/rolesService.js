/**
 * @component: factory
 * @name: gb.services.rolesService
 * @Stability:
 * @description: 获取客服分组和分组在线成员信息
 * @author: xbird
 */

angular.module('gb.services.rolesService', [])
    .factory('RolesResource', ['$resource','$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';

            var rolesResource;
            if ($gbSetting.isMockEnv) {
                rolesResource = $resource('/mock/role/fullInfo.json');
            }else{
                rolesResource = $resource('/role/fullInfo');
            }
            return rolesResource;
        }]);