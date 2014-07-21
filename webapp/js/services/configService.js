/**
 * @component: resource
 * @name: gb.services.configService
 * @Stability:
 * @description: 获取客服分组和分组在线成员信息
 * @author: xbird, Patrick
 */

angular.module('gb.services.configService', [])
    // 应用运行参数，从应用角度
    .factory('AppResource', ['$resource', '$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';

            var appResource;
            if ($gbSetting.isMockEnv) {
                appResource = $resource('/mock/app.json');
            }else{
                appResource = $resource('/mock/app.json');
            }
            return appResource;
        }])
    // 应用环境设置，从用户角度
    .factory('SettingResource', ['$resource', '$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';

            // var settingResource = $resource('/mock/user/:userId/settings.json', {userId: '@id'}); // or
            var settingResource;
            if ($gbSetting.isMockEnv) {
                settingResource = $resource('/mock/user/settings.json');
            }else{
                settingResource = $resource('/mock/user/settings.json');
            }
            return settingResource;

        }]);