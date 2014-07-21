/**
 * @component: factory
 * @name: gb.services.userService
 * @Stability:
 * @description: 获取用户信息，包括基本信息和配置等myTasks
 * @author: xbird
 */

angular.module('gb.services.userService', [])
    .factory('UserResource', [ '$resource', '$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';

            var userResource;
            if ($gbSetting.isMockEnv) {
                userResource = $resource('/mock/user/:userId/settings.json', {userId: '@id'}, {
                    selectsettings: { method: 'GET' },
                    selectMyTasks: { method: 'GET', url: '/mock/user/:userId/task.json', params: { userId: '@id' } },
                    searchMyTasks: { method: 'GET', url: '/mock/user/:userId/task/searchInput/:searchInput.json', params: { userId: '@id', searchInput: '' } },
                    logout: { method: 'GET', url: '/mock/user/:userId/logout.json', params: { userId: '@id' }},
                    info: { method: 'GET', url: '/mock/user/:userId/info.json', params: { userId: '@id' } },
                    markByLogout: { method: 'POST', url: '/mock/user/:userId/logout.json', params: { userId: '@userId' }},
                    login: { method: 'GET', url: '/mock/login/info.json' }
                });
            } else {
                //TODO URL
                userResource = $resource('/mock/user/:userId/settings.json', {userId: '@id'}, {
                    selectsettings: { method: 'GET' },
                    selectMyTasks: { method: 'GET', url: '/user/:userId/task', params: { userId: '@id' } },
                    searchMyTasks: { method: 'GET', url: '/user/:userId/task/searchInput/:searchInput', params: { userId: '@id', searchInput: '' } },
                    logout: { method: 'GET', url: '/user/:userId/logout', params: { userId: '@id' }},
                    info: { method: 'GET', url: '/user/:userId/info', params: { userId: '@id' } },
                    markByLogout: { method: 'POST', url: '/user/:userId/logout', params: { userId: '@userId' }},
                    login: { method: 'GET', url: '/login/info' }
                });
            }
            return userResource;
        }

    ]);