/**
 * @component: factory
 * @name: gb.services.smsService
 * @Stability:
 * @description: 获取客服分组和分组在线成员信息
 * @author: xbird
 */

angular.module('gb.services.smsService', [])
    .factory('SmsResource', ['$resource', '$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';
            var smsResource;
            if ($gbSetting.isMockEnv) {
                smsResource = $resource('/mock/sms/searchInput/:searchInput.json', { searchInput: '' }, {
                    search: { method: 'GET' }
                });
            } else {
                smsResource = $resource('/sms/searchInput/:searchInput', { searchInput: '' }, {
                    search: { method: 'GET' }
                });
            }
            return smsResource;
        }]);