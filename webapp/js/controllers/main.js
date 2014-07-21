/**
 * @component: controller
 * @name: main
 * @Stability:
 * @description: 用户主页控制器
 *               该控制器有两个功能
 *               1)、作为数据仓库，所有信息都在这里存储
 *               2)、向服务器发出的增删查改等操作都需经由这里发送请求，再通知视图控制器更新视图
 * @author: xbird, Patrick
 */

angular.module('main', [])
    .controller('mainCtrl', [
        '$scope',
        '$cookieStore',
        'appConfigurator',
        'AppResource',
        'SettingResource',
        'contextService',
        'UserResource',
        'TasksResource',
        '$state',
        '$gbSetting',
        function ($scope, $cookieStore, appConfigurator, AppResource, SettingResource, contextService, UserResource, TasksResource, $state, $gbSetting) {
            'use strict';

            // 用户登陆
            UserResource.login();

            appConfigurator.setStatus('_userid', $cookieStore.get('_user_id_'));
            appConfigurator.setStatus('_username', $cookieStore.get('_real_name_'));

            //== 变量定义和scope
            $scope.status = {
                workplace: 1, // 工作地点；1:正常.2:来电
                phone: ''
            };
            $scope.mapping = null;
            $scope.userInfo = {};

            // 激活的菜单栏
            $scope.activedMenu = {};

            // 消息提示
            $scope.notices = {
                alarm: { faces: '提醒', number: [], quantity: 0, type: '1' },
                involve: { faces: '介入', number: [], quantity: 0, type: '2' },
                remain: { faces: '未成', number: [], quantity: 0, type: '3' },
                incoming: { faces: '来电', number: [], quantity: 0, type: '4' },
                dispatch: { faces: '派发', number: [], quantity: 0, type: '5' }
            };

            if ($gbSetting.isUsingWebSocket) {
                // 建立WebSocket
                var noticesWebSocket; // 消息提醒WebSocket
                var connectWebSocket = function connectWebSocket() {

                    // 实时通信的WebSocket
                    noticesWebSocket = new WebSocket($gbSetting.webSocketAddress);

                    noticesWebSocket.onopen = function (data) {
                        console.log('Connect to WebSocket server.');
                    };

                    noticesWebSocket.onclose = function (data) {
                        connectWebSocket();
                        console.log('Disconnet to WebSocket server');
                    };

                    noticesWebSocket.onerror = function (data) {
                        console.log('WebSocket Error: ' + data);
                    };

                    noticesWebSocket.onmessage = function (msg) {
                        var mapTmp = ['alarm', 'involve', 'remain', 'incoming', 'dispatch'],
                            type,
                            phone;

                        var data = angular.element.parseJSON(msg.data);

                        if (!data.type) return;
                        type = mapTmp[Number(data.type) - 1];
                        if (type === 'incoming') {
                            phone = String(data.numbers[0]);
                            if (!phone) return;

                            $scope.$broadcast('saveContext'); // 通知保存上下文
                            contextService.create(); // 新建一个上下文对象
                            $scope.status.workplace = 2;
                            if ($state.current.name === 'main.dashboard') {
                                // $state.reload();
                                $scope.$broadcast('incomingRefresh', phone);
                            } else {
                                $state.go('main.dashboard');
                            }
                            $scope.status.phone = phone;
                        }

                        $scope.notices[type].quantity = data.quantity;
                        $scope.notices[type].number = data.numbers;
                        $scope.$saferApply();
                    };
                };


                connectWebSocket(); // 建立WebSocket
            }

            //== 初始化App
            // 用户ID
            var userId = appConfigurator.getStatus('_userid');

            contextService.create(); // 新建一个上下文对象

            // 初始应用需要的参数，针对应用
            AppResource.get().$promise.then(function (resp) {
                if (!Number(resp.result)) return;
                $scope.mapping = resp.data.mapping; // WARNING，数据应保存在服务里
            });

            // 初始用户使用应用的环境，针对用户
            SettingResource.get({ userId: userId }).$promise.then(function (resp) {
                $scope.userMenus = resp.data.array[0].menus;
            });

            UserResource.info({ userId: userId }).$promise.then(function (resp) {
                $scope.userInfo.userId = angular.copy(resp.data.userId);
                $scope.userInfo.userName = angular.copy(resp.data.userName);
                $scope.userInfo.roles = angular.copy(resp.roles);
            });


            // setTimeout(function() {
            //   var data = {
            //     owner : null,
            //     type : 3,
            //     quantity : 0,
            //     numbers : [15013322786]
            //   }

            //   var mapTmp = ['alarm', 'involve', 'remain', 'incoming', 'dispatch'],
            //       type,
            //       phone;

            //   if (!data.type) return;
            //   type = mapTmp[Number(data.type) - 1];
            //   if (type === 'incoming') {
            //     phone = String(data.numbers[0]);
            //     if (!phone) return;

            //     $scope.$broadcast('saveContext'); // 通知保存上下文
            //     contextService.create(); // 新建一个上下文对象
            //     $scope.status.workplace = 2;
            //     if ($state.current.name === 'main.dashboard') {
            //       // $state.reload();
            //       $scope.$broadcast('incomingRefresh', phone);
            //     } else {
            //       $state.go('main.dashboard');
            //     }
            //     $scope.status.phone = phone;
            //   }

            //   $scope.notices[type].quantity = data.quantity;
            //   $scope.notices[type].number = data.numbers;
            //   $scope.$saferApply();


            // }, 3000);


            //
            //== 全局事件

            // 事件中转
            $scope.$on('forwardingEvent', function (e, event, data) {
                $scope.$broadcast(event, data);
            });

            // 激活菜单栏
            $scope.$on('activeMenu', function (e, data) {
                $scope.activedMenu.id = data;
                appConfigurator.setStatus('_acitvedMenuID', data);
            });

            // 挂电话
            $scope.$on('hangUp', function () {
                contextService.pop();
                $scope.$broadcast('currentRefresh');
            });

            // 刷新按钮
            $scope.refresh = function () {
                $scope.$broadcast('fetchRefresh');
            };

            $scope.dispatchTask = function () {
                TasksResource.assign();
            };

        }]);