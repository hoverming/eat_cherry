/**
 * @component: controller
 * @name: gb.services.taskService
 * @Stability:
 * @description: 对工单的操作
 * @author: xbird
 */

angular.module('gb.services.taskService', [])
    .factory('TasksResource', ['$resource', '$gbSetting',
        function ($resource, $gbSetting) {
            'use strict';

            var tasksResource;
            if ($gbSetting.isMockEnv) {
                /**
                 * select   选择所有工单
                 * search   根据条件查找工单
                 * involve  介入工单
                 * create   新建工单
                 * assign   指派工单
                 * follow   跟进工单
                 * remarkToggle 标签已读
                 */
                tasksResource = $resource('/mock/task.json', null, {
                    select: { method: 'GET' },
                    search: { method: 'GET', url: '/mock/task/searchInput/:searchInput.json', params: { searchInput: '' } },
                    involve: { method: 'GET', url: '/task/:taskCode/involve', params: { taskCode: '@taskCode' } },
                    create: { method: 'GET', url: '/task/add'},
                    follow: { method: 'GET', url: '/task/:taskCode/deal', params: { taskCode: '@taskCode' } },
                    assign: { method: 'GET', url: '/task/assign' },
                    remarkToggle: { method: 'GET', url: '/remark/:taskCode/remarkToggle', params: { taskCode: '@taskCode' } }
                });
            } else {
                tasksResource = $resource('/task', {}, {
                    select: { method: 'GET' },
                    search: { method: 'GET', url: '/task/searchInput/:searchInput', params: { searchInput: '' } },
                    involve: { method: 'GET', url: '/task/:taskCode/involve', params: { taskCode: '@taskCode' } },
                    create: { method: 'GET', url: '/task/add'},
                    follow: { method: 'GET', url: '/task/:taskCode/deal', params: { taskCode: '@taskCode' } },
                    assign: { method: 'GET', url: '/task/assign' },
                    remarkToggle: { method: 'GET', url: '/remark/:taskCode/remarkToggle', params: { taskCode: '@taskCode' } }
                });
            }
            return tasksResource;

        }]);
