/**
 * @component: core
 * @name: greenbird
 * @description:  Declare app level module which depends on filters, and services
 * @author: Patrick
 * @creat on: 2014/6/29.
 */
angular.module('greenbird', [
    'ngTable',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ui.bootstrap.datetimepicker',
    'cfp.hotkeys',
    'greenbird.module',
    'greenbird.constants',
    'greenbird.filters',
    'greenbird.services',
    'greenbird.directives',
    'greenbird.controllers',
    'greenbird.constructor'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('loading', { url: '/loading', templateUrl: 'partials/loading.html', controller: 'loadingCtrl' })
                // .state('login', { url: '/login', templateUrl: 'partials/login.html', controller: 'loginCtrl' })
                .state('main', { url: '/main', templateUrl: 'partials/main.html', controller: 'mainCtrl' })
                .state('logout', { url: '/logout', templateUrl: 'partials/logout.html', controller: 'logoutCtrl' })
                .state('main.dashboard', { url: '/dashboard', templateUrl: 'partials/dashboard.html', controller: 'mainDashboardCtrl' })
                .state('main.mytasks', { url: '/mytasks', templateUrl: 'partials/mytasks.html', controller: 'mainMytasksCtrl' })
                .state('main.order', {  url: '/orders', templateUrl: 'partials/orders.html', controller: 'orderCtrl' })
                .state('main.other', { url: '/other', templateUrl: 'partials/other.html', controller: 'mainOtherCtrl' });

            // For any unmatched url, redirect to /loading
            $urlRouterProvider.otherwise("/loading");
        }
    ])
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                $('#mask').hide();
                return response;

            }, function (response) {
                $('#mask').hide();
                return $q.reject(response);
            });
        };
    })
    .config(['$httpProvider', function ($httpProvider) {

        $httpProvider.responseInterceptors.push('myHttpInterceptor');

        $httpProvider.defaults.transformRequest = function(obj){

            $('#mask').show();
            var str = [];
            for(var p in obj){
                var value = "";
                if(obj[p] !== null ){
                    value = encodeURIComponent(obj[p]);
                }
                str.push(encodeURIComponent(p) + "=" + value);
            }
            return str.join("&");
        };

        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };
    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$saferApply = function (exp) {
            if (!this.$$phase) {
                this.$apply(exp);
            } else {
                try {
                    this.$eval(exp);
                } catch (ex) {
                    $exceptionHandler(ex);
                } finally {
                    this.$digest();
                }
            }
        };
    }]);

/**
 * @description: Constants 集合器
 *               所有需要注入app的constants，都要在这里注册
 *
 * @author: patrick
 */

angular.module('greenbird.constants', [
    'gb.order.constants'
]);
angular.module('gb.order.constants',[])
    .constant('orderConstants', {
        //-- 订单状态
        'statuses': {
            '10': "已提交",
            '20': "已支付",
            '50': "备货中",
            '60': "已发货",
            '70': "已签收",
            '120': "已取消"
        },
        //-- 销售渠道
        'channels': {
            '1': "飞飞商城",
            '2': "天猫商城",
            '3': "善融商城",
            '4': "线下销售",
            '5': "天猫家居专营店_日用品",
            '6': "天猫家居用品专营店_家具",
            '7': "天猫电器专营店",
            '8': "Global Sale",
            '9': "飞飞Web商城",
            '10': "飞飞手机商城",
            '11': "天猫淘宝店",
            '12': "360商城",
            '13': "360",
            '14': "善融商城",
            '15': "Globalmarket"
        },
        //-- 监控状态
        'healthStatuses': {
            '0': "正常",
            '1': "异常"
        },
        //-- 货币
        'currencies': {
            '1': "CNY",  //人民币
            '2': "HKD",  //港币
            '3': "EUR",  //欧元
            '4': "USD",  //美元
            '5': "GBP"  //英镑
        },
        'currencyIcons': {
            '1': "fa-rmb",  //人民币
            '2': "HKD",  //港币
            '3': "fa-eur",  //欧元
            '4': "fa-usd",  //美元
            '5': "fa-gbp"  //英镑
        },
        //-- 发货类型
        'shippingTypes': {
            '1': "飞飞",
            '2': "厂家直发"
        },
        //-- 订单类型
        'orderTypes': {
            '1': "普通订单",
            '2': "RMA订单"
        },
        //-- 支付状态
        'paymentStatuses': {
            '10': "未付款",
            '20': "部分付款",
            '30': "已付款"
        },
        //-- 支付事务类型
        'paymentTransactionTypes': {
            '1': "支付",
            '2': "退款"
        },
        //-- 运输类型
        'shippingMethods': {
            'zwt': "自委托",
            'shipping': "海运",
            'land': "陆运",
            'air': "空运"
        },
        //-- 运输状态
        'shippingStatuses': {
            '10': "未处理",
            '30': "已扣减库存",
            '40': "已下发到仓库",
            '50': "仓库已确认",
            '60': "已发货",
            '70': "已收货",
            '80': "已取消",
            '90': "仓库异常"
        }
    });

/**
 * @description: Controllers 集合器
 *               所有需要注入app的controller，都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 */

angular.module('greenbird.controllers', [
  'loading',
  'logout',
  'login',
  'main',
  'main.header',
  'main.dashboard',
  'main.mytasks',
  'main.order',
  'main.other'
]);



angular.module('loading', [])
  .controller('loadingCtrl', ['$state', '$cookieStore', 'UserResource', function($state, $cookieStore, UserResource) {
    UserResource.login().$promise.then(function(resp) {
      $cookieStore.put('_user_id_', resp.data.userId);
      $cookieStore.put('_user_name_', resp.data.userName);
      $state.go('main.dashboard');
    });
  }]);

/**
 * @component: controller
 * @name：login
 * @Stability:
 * @description: 登录页面控制器
 * @author：hcz
 */

angular
  .module('login', ['ngCookies'])
  .controller(
    'loginCtrl',
    [
      '$scope',
      '$cookies',
      '$http',
      '$location',
      function ($scope, $cookies, $http, $location) {
        'use strict';

        // $location.path('/main');

        // cookir设置
        var name = $cookies.userName;
        $cookies.userName="ok";

        // 登陆
        var login = function (event, user) {
          angular.module('login', [])
            .controller('loginCtrl', ['$scope', '$http',
              function($scope, $http) {      
                $http({
                  method: 'POST',  
                  url: '/mock/test.json',
                  data: {
                    userName: 'admin',
                    password: '123'
                  }
                })
                .success(function (data, status) {
                  $scope.status = status;
                  $scope.data = data;
                  if ($scope.data.code === $scope.status) {
                    $scope.warningText = '登录成功';
                  }
                })
                .error(function (data, status) {
                  $scope.status = status;
                  $scope.data = data;
                  if ($scope.data.code === $scope.status) {
                    $scope.warningText = '账号或者密码错误，请重新输入';
                  }
                });
              }
            ]
          );
          $scope.$on('doLogin', login);
        };
      }
    ]
  );

angular.module('logout', [])
  .controller('logoutCtrl', ['$location', '$scope', '$gbSetting', function($location, $scope, $gbSetting) {
    window.location.href = $gbSetting.loginAddress + '/login.htm?action=loginAction&eventSubmitDoLogout=yes';
  }]);

/**
 * @component: controller
 * @name: main.dashboard
 * @Stability:
 * @description: 仪表盘
 * @author: xbird
 */

angular.module('main.dashboard', [])
  .controller('mainDashboardCtrl', [
    '$scope',
    '$filter',
    'TaskForm',
    'SmsResource',
    'TasksResource',
    'ngTableParams',
    'appConfigurator',
    'contextService',
    '$state',
    function($scope, $filter, TaskForm, SmsResource, TasksResource, TableParams, appConfigurator, contextService, $state) {
      'use strict';

      //
      //== 变量定义和scope

      var scopeList = ['ds_selectedTask', 'taskForm', 'allTasks', 'ds_allSms'], // 需要保存至上下文对象的scope
          len,
          i;
      $scope.ds_selectedTask = {}; // 单击单条工单时，显示的详细Remark信息
      $scope.taskForm = new TaskForm(); // 工单表单
      $scope.allTasks = []; // 所有工单
      $scope.ds_allSms = []; //验证码

      // 过度变量，用于将工单类型和用户组匹配。TDDO！！！
      var taskTypeToRoleId = { "1": '接听', "2": '接听', "3": '订单', "4": '订单', "5": '退换货', "6": '退换货', "7": '接听', "8": '退换货', "9": '接听' };


      //
      //== 监视数据变动

      // 所有工单
      $scope.$watch('allTasks', function() {
        $scope.allTaskTableParams.reload();
      });

      // 验证码
      $scope.$watch('ds_allSms', function() {
        $scope.allSmsTableParams.reload();
      });


      $scope.$watch('taskForm.type.value', function(data) {
        $scope.taskForm.assignedGroup.value = taskTypeToRoleId[String(data)];
      });


      //
      //== 初始化dashboard面板

      $scope.$emit('activeMenu', 'dashboard'); // 激活dashboard菜单栏

      // 初始化所有工单
      if (contextService.get('allTasks')) {
        $scope.allTasks = angular.copy(contextService.get('allTasks'));
      } else {
        TasksResource.select().$promise.then(function(resource) {
          $scope.allTasks = angular.copy(resource.data.array);
        });
      }

      // 初始化Remark details
      if (contextService.get('ds_selectedTask')) {
        $scope.ds_selectedTask = angular.copy(contextService.get('ds_selectedTask'));
      }

      // 初始化工单表单
      if (contextService.get('taskForm')) {
        $scope.taskForm = angular.copy(contextService.get('taskForm'));
      }

      // 初始化验证码
      if (contextService.get('ds_allSms')) {
        $scope.ds_allSms = angular.copy(contextService.get('ds_allSms'));
      }


      // 初始化所有工单Table的交互
      $scope.allTaskTableParams = new TableParams({
        page: contextService.get('allTasksPage') || 1,
        count: contextService.get('allTasksCount') || 10
      }, {
        counts: [4, 10, 25, 50],
        total: 0,
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')($scope.allTasks, params.orderBy()) : $scope.allTasks;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
      });

      // 初始化验证码Table的交互
      $scope.allSmsTableParams = new TableParams({
        page: 1,
        count: 10
      }, {
        counts: [4, 10, 25, 50],
        total: 0,
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')($scope.ds_allSms, params.orderBy()) : $scope.ds_allSms;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
      });


      //
      //== dashboard事件

      // 触发保存上下文
      $scope.$on('saveContext', function() {
        var keyTmp;
        for (i = 0, len = scopeList.length; i < len; i += 1) {
          keyTmp = scopeList[i];
          contextService.set(keyTmp, angular.copy($scope[keyTmp]));
        }
      });

      // 对头部全局搜索的响应
      $scope.$on('globalSearch', function(e, data) {
        var type = angular.element('.ng-isolate-scope.active').data('type');
        if (type == 1) {
          TasksResource.search({ searchInput: data }).$promise.then(function(resource) {
            $scope.allTasks = resource.data.array;
          });
        } else if (type == 2) {
          SmsResource.search({ searchInput: data }).$promise.then(function(resource) {
            $scope.ds_allSms = resource.data.array;
          });
        }
      });

      $scope.$on('showAlarm', function(e, data) {
        var action = data;
        if (action === 'showAlarm') {
          $scope.taskForm.alertTime.disabled = false;
        } else {
          $scope.taskForm.alertTime.value = '0000-00-00 00:00:00';
          $scope.taskForm.alertTime.disabled = true;
        }
        $scope.$saferApply();
      });

      // 在所有工单表里，对单条工单增加、介入和新建操作的响应，主要响应结果体现在taskForm里
      $scope.$on('operateSingleTask', function(e, method, data) {

        var invisibleList, disabledList, keyTmp, len, i;

        // 对工单进行不同操作时，对taskForm disabled状态设置的映射值
        var methodToDisabled = {
          create: [],
          follow: ['emergent', 'name', 'phone', 'email', 'businessCode', 'type'],
          involve: ['emergent', 'name', 'phone', 'email', 'businessCode', 'type']
        };

        // 对工单进行不同操作时，对taskForm invisible状态设置的映射值
        var methodToInvisible = {
          create: ['assignedGroup', 'assignedOwner', 'involve'],
          follow: ['assignedGroup', 'assignedOwner', 'involve'],
          involve: ['assignedGroup', 'assignedOwner', 'status']
        };

        // 过滤disabledList指定的控件，使其不可用
        disabledList = methodToDisabled[method];
        for (i = 0, len = (disabledList.length || []); i < len; i += 1) {
          keyTmp = disabledList[i];
          if (data[keyTmp]) {
            data[keyTmp].disabled = true;
          }
        }

        // 过滤invisibleList指定的控件，使其不可见
        invisibleList = methodToInvisible[method];
        for (i = 0, len = (invisibleList.length || []); i < len; i += 1) {
          keyTmp = invisibleList[i];
          if (data[keyTmp]) {
            data[keyTmp].invisible = true;
          }
        }

        data.submit.action = method;
        data.submit.disabled = true;

        angular.extend($scope.taskForm, data);
        $scope.$saferApply();
      });

      // 单击选择单条工单时的响应，主要响应体现在显示相应交互信息
      $scope.$on('selectSingleTask', function(e, data) {
        var dataTmp = {};

        // 需要对emit传过来的数据过滤
        dataTmp.taskVo = data.taskVo;
        dataTmp.taskRemarkVos = data.taskRemarkVos;

        $scope.ds_selectedTask = angular.copy(dataTmp);
        $scope.$saferApply();
      });

      // 操作TaskForm
      $scope.$on('operateTask', function(e, data) {

        var action = data, param = {}, fields, len, i, valTmp, keyTmp, pattTmp;

        // 不同的操作所需要的字段
        var operateToFields = {
          // 新建
          create: ['userId', 'content', 'name', 'phone', 'email', 'businessCode', 'type', 'emergent', 'status', 'alertTime', 'assignedGroup', 'assignedOwner'],
          // 跟进
          follow: ['userId', 'content', 'status', 'taskCode'],
          // 指派
          assign: ['userId', 'content', 'taskCode'],
          // 介入
          involve: ['userId', 'content', 'taskCode', 'alertTime']
        };

        fields = operateToFields[action] || [];

        // 生成请求的参数
        for (i = 0, len = fields.length; i < len; i += 1) {
          keyTmp = fields[i];
          valTmp = $scope.taskForm[keyTmp] && $scope.taskForm[keyTmp].value;
          if (typeof valTmp === 'undefined') {
            valTmp = appConfigurator.getStatus('_' + keyTmp.toLowerCase()) || '';
          }
          //----------
          if (keyTmp === 'phone') {
            if (! /^[0-9\-()（）]{7,18}$/.test(valTmp)) {
              alert('无效号码');
              return false;
            }
          } else if (keyTmp === 'email') {
            // if (! /^(?:[a-z0-9]+[_\-+.]?)*[a-z0-9]+@(?:([a-z0-9]+-?)*[a-z0-9]+.)+([a-z]{2,})+$/.test(valTmp)) {
            //   alert('无效邮箱');
            //   return false;
            // }
          } else if (keyTmp === 'alertTime' && $scope.taskForm.alertTime.disabled === false) {
            if (! /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/.test(valTmp)) {
              alert('呜呜...，先忍忍哈！我尽快弄个时间控件。无效时间！');
              return false;
            } else if (Date.now() > Date.parse(valTmp)) {
              alert('时间设得有点早');
              return false;
            }
          }
          //----------
          param[keyTmp] = valTmp;
        }

        console.log(param);

        TasksResource[action].call(null, param).$promise.then(function(data) {
          if (data && data.result == 1) {
            $scope.$emit('fetchRefresh');
            alert('操作成功');
          } else {
            alert('操作失败');
          }
        });
      });

      // 自刷新
      $scope.$on('fetchRefresh', function() {
        $scope.ds_selectedTask = {}; // 清空详细Remark信息
        $scope.taskForm = new TaskForm(); // 清空工单表单
        TasksResource.select().$promise.then(function(resource) {
          $scope.allTasks = angular.copy(resource.data.array);
        }); // 重新获取数据
      });

      $scope.$on('incomingRefresh', function(e, phone) {
        $scope.ds_selectedTask = {}; // 清空详细Remark信息
        $scope.taskForm = new TaskForm({
          phone: {
            value: phone
          }
        }); // 清空工单表单
        TasksResource.search({searchInput: phone}).$promise.then(function(resource) {
          $scope.allTasks = angular.copy(resource.data.array);
        });
      });

      // 从contextService里获取数据
      $scope.$on('currentRefresh', function() {
        $scope.status.workplace = 1; // 工作状态改为正常(1)
        for (i = 0, len = scopeList.length; i < len; i += 1 ) {
          var scopeNameTmp = scopeList[i];
          $scope[scopeNameTmp] = angular.copy(contextService.get(scopeNameTmp));
        }
        $scope.$saferApply();
      });

    }]);
/**
 * @component: controller
 * @name: main.header
 * @Stability:
 * @description: main页头部
 * @author: xbird
 */

angular.module('main.header', [])

  .controller('mainHeaderCtrl', [
    '$scope',
    '$modal',
    '$state',
    '$log',
    'UserResource',
    'appConfigurator',
    function($scope, $modal, $state, $log, UserResource, appConfigurator) {
      'use strict';

      //
      //== 头部事件

      $scope.$on('logout', function() {

        var unlabeledTasks = [],
            unlabeledTaskIds = [];

        UserResource.logout({
          userId: appConfigurator.getStatus('_userid')
        }).$promise.then(function(data) {
          unlabeledTasks = data.data.array;
          for (var i = 0, len = unlabeledTasks.length; i < len; i += 1) {
            unlabeledTaskIds.push(unlabeledTasks[i].taskCode);
          }
          var controller = function($scope, $modalInstance, UserResource) {

            $scope.remain = unlabeledTasks.length;

            $scope.logout = function() {
              UserResource.markByLogout({
                userId: appConfigurator.getStatus('_userid'),
                content: angular.element('.modal-logout textarea').val(),
                taskIds: unlabeledTaskIds
              });
              $modalInstance.dismiss('cancel');
              $state.go('logout');
            };

            $scope.myTasks = function() {
              $modalInstance.dismiss('cancel');
            };
          };

          var modalInstance = $modal.open({
            templateUrl: 'dest/template/modal/logouttips.html',
            controller: controller,
            size: 'sm',
            windowClass: 'modal-warning modal-logout',
          });

          modalInstance.result.then(function () {
            console.log('yes');
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        });
      });
    }]);

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
/**
 * @component: controller
 * @name: main.mytasks
 * @Stability:
 * @description: 我的工单
 * @author: xbird
 */

angular.module('main.mytasks', [])
  .controller('mainMytasksCtrl', [
    '$scope',
    '$filter',
    'appConfigurator',
    'UserResource',
    'ngTableParams',
    'contextService',
    'TasksResource',
    'TaskForm',
    function($scope, $filter, appConfigurator, UserResource, TableParams, contextService, TasksResource, TaskForm) {
      'use strict';

      //
      //== 变量定义和scope

      var scopeList = ['myTasks', 'mt_selectedTask', 'mt_taskForm'],
          userId = appConfigurator.getStatus('_userid'),
          len,
          i;

      $scope.mt_selectedTask = {}; // 单击单条工单时，需显示的详细互动信息
      $scope.myTasks = []; // 我的工单
      $scope.mt_taskForm = new TaskForm({
        status: { value: 1, disabled: true },
        content: { value: '', disabled: true }
      });

      // 由于需要高亮提示工单，所以需要过滤
      var filterMyTasks = function(data) {
        var dataTmp = data,
            remarkTmp,
            taskTmp = null,
            lenTmp,
            iTmp,
            tag;

        for (i = 0, len = dataTmp.length; i < len; i += 1) {
          tag = 0;
          taskTmp = dataTmp[i];
          for (iTmp = 0, lenTmp = taskTmp.taskRemarkVos.length; iTmp < lenTmp; iTmp += 1) {
            remarkTmp = taskTmp.taskRemarkVos[iTmp];
            if (Number(remarkTmp.remarkRead) === 2) {
              tag = 1;
              break;
            }
          }
          taskTmp.taskVo.remarkRead = tag;
        }
        return angular.copy(dataTmp);
      };

      var fetchMyTasks = function fetchMyTasks() {
        UserResource.selectMyTasks({ userId: userId }).$promise.then(function(resource) {
          $scope.myTasks = filterMyTasks(resource.data.array);
        });
      };


      //
      //== 监视数据变动

      $scope.$watch('myTasks', function() {
        $scope.myTaskTableParams.reload();
      });


      //
      //== 初始化mytask面板

      $scope.$emit('activeMenu', 'mytasks'); // 激活dashboard菜单栏

      // 初始化我的工单
      if (contextService.get('myTasks')) {
        $scope.myTasks = angular.copy(contextService.get('myTasks'));
      } else {
        fetchMyTasks();
      }

      // 初始化Remark details
      if (contextService.get('mt_selectedTask')) {
        $scope.mt_selectedTask = angular.copy(contextService.get('mt_selectedTask'));
      }

      // 初始化工单表单
      if (contextService.get('mt_taskForm')) {
        $scope.mt_taskForm = angular.copy(contextService.get('mt_taskForm'));
      }

      // 初始化我的工单Table的交互
      $scope.myTaskTableParams = new TableParams({
        page: 1,
        count: 10
      }, {
        counts: [5, 10, 25, 50],
        total: 0,
        getData: function($defer, params) {
          var orderedData = params.sorting() ? $filter('orderBy')($scope.myTasks, params.orderBy()) : $scope.myTasks;
          params.total(orderedData.length);
          $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        },
        $scope: { $data: {} }
      });


      //
      //== myTask事件

      // 触发保存上下文
      $scope.$on('saveContext', function() {
        var keyTmp;
        for (i = 0, len = scopeList.length; i < len; i += 1) {
          keyTmp = scopeList[i];
          contextService.set(keyTmp, angular.copy($scope[keyTmp]));
        }
      });

      // 对头部全局搜索的响应
      $scope.$on('globalSearch', function(e, data) {
        UserResource.searchMyTasks({
          userId: userId,
          searchInput: data
        }).$promise.then(function(data) {
          $scope.myTasks = filterMyTasks(data.data.array);
        });
      });

      // 自刷新，从服务器获取最新数据
      $scope.$on('fetchRefresh', function() {
        $scope.mt_selectedTask = {}; // 清空详细Remark信息
        $scope.mt_taskForm = new TaskForm({
          status: { value: 1, disabled: true },
          content: { value: '', disabled: true }
        });
        fetchMyTasks(); // 重新获取数据
      });

      // 从contextService里获取数据
      $scope.$on('currentRefresh', function() {
        $scope.status.workplace = 1; // 工作状态改为正常(1)
        for (i = 0, len = scopeList.length; i < len; i += 1 ) {
          var scopeNameTmp = scopeList[i];
          $scope[scopeNameTmp] = angular.copy(contextService.get(scopeNameTmp));
        }
        $scope.$saferApply();
      });

      $scope.$on('mtShowAlarm', function(e, data) {
        var action = data;
        if (action === 'showAlarm') {
          $scope.mt_taskForm.alertTime.disabled = false;
        } else {
          $scope.mt_taskForm.alertTime.value = '';
          $scope.mt_taskForm.alertTime.disabled = true;
        }
        $scope.$saferApply();
      });

      // 单击选择单条工单时的响应，主要响应体现在显示相应交互信息、是否禁用taskForm和提示
      $scope.$on('selectSingleTask', function(e, data) {
        var i;

        // 提示
        if (Number(data.taskVo.remarkRead) === 1) {
          if ($scope.notices.alarm.number.indexOf(data.taskCode) > -1) {
            i = $scope.notices.alarm.number.indexOf(data.taskCode);
            $scope.notices.alarm.number.splice(i, 1);
            $scope.notices.alarm.quantity--;
          }
          if($scope.notices.involve.number.indexOf(data.taskCode) > -1){
            i = $scope.notices.involve.number.indexOf(data.taskCode);
            $scope.notices.involve.number.splice(i, 1);
            $scope.notices.involve.quantity--;
          }
          TasksResource.remarkToggle({ taskCode: data.taskCode });
          data.taskVo.remarkRead = 0;
        }

        // 交互信息
        $scope.mt_selectedTask = angular.copy(data);

        // 是否禁用taskForm
        if (data.taskVo.status == 2) {
          $scope.mt_taskForm.status.disabled = false;
          $scope.mt_taskForm.content.disabled = false;
          $scope.mt_taskForm.submit.disabled = false;
        } else {
          $scope.mt_taskForm.status.disabled = true;
          $scope.mt_taskForm.content.disabled = true;
          $scope.mt_taskForm.submit.disabled = true;
        }
        $scope.$saferApply();
      });

      $scope.operateTask = function() {
        var params = {
          userId: userId,
          content: $scope.mt_taskForm.content.value,
          status: $scope.mt_taskForm.status.value,
          taskCode: $scope.mt_selectedTask.taskCode,
          alertTime: $scope.mt_taskForm.alertTime.value
        };

        if ($scope.mt_taskForm.alertTime.disabled === false) {
          if (! /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/.test(params.alertTime)) {
            alert('呜呜...，先忍忍哈！我尽快弄个时间控件。无效时间！');
            return false;
          } else if (Date.now() > Date.parse(params.alertTime)) {
            alert('时间设得有点早');
            return false;
          }
        }

        TasksResource.follow(params).$promise.then(function(data) {
          console.dir(data);
        });
      };

    }]);

/**
 * @component: controller
 * @name: main.order
 * @description:
 * @author: Patrick
 * @creat on: 2014/6/29.
 */

angular.module('main.order', [])
    .controller('orderCtrl', [
        '$scope',
        '$filter',
        'ngTableParams',
        'OrderResource',
        'orderConstants',
        '$gbSetting',
        'hotkeys',
        function ($scope, $filter, TableParams, OrderResource, orderConstants, $gbSetting, hotkeys) {
            'use strict';
            //-- 激活菜单栏
            $scope.$emit('activeMenu', 'orders');

            //-- 定义模板
            $scope.templates = {
                //订单列表-
                "list" : '/partials/order/list.html',
                //订单查询
                "query" : '/partials/order/query.html',
                //订单明细
                "detail" : '/partials/order/detail.html',
                //订单明细--基本信息
                "detailBasicInfo" : '/partials/order/detail/basicInfo.html',
                //订单明细--详细信息
                "detailFullInfo" : '/partials/order/detail/fullInfo.html',
                //订单明细--支付信息
                "detailPayInfo" : '/partials/order/detail/payInfo.html',
                //订单明细--配送信息
                "detailShipmentInfo" : '/partials/order/detail/shipmentInfo.html',
                //订单明细--商品评论
                "detailComments" : '/partials/order/detail/comments.html'
            };

            //-- 查询条件常量
            $scope.orderConstants = orderConstants;

            //-- 查询条件模型
            $scope.searchCriteria = {
                //订单编号,多个用逗号分隔
                "number" : "",
                //SKU编号
                "skuNumber" : "",
                //SKU名称
                "skuName" : "",
                //收货人姓名
                "receiverName" : "",
                //收货人电话
                "receiverTel" : "",
                //客户账户名
                "acountName" : "",
                //订单查询状态
                "orderStatus" : "",
                //销售渠道
                "channelId" : "",
                //监控状态
                "healthMonitor" : "",
                //支付状态
                "paymentStatus" : "",
                //创建时间开始
                "createTimeBegin" : "",
                //创建时间结束
                "createTimeEnd" : "",
                //厂家sfaId
                "sfaId" : ""
            };
            //用于记录下用户点击查询按钮时候的查询条件
            $scope.searchCriteriaSaved = angular.copy($scope.searchCriteria);

            //触发查询
            $scope.triggerSearch = function(){
                //用于记录下此时间点的查询条件
                $scope.searchCriteriaSaved = angular.copy($scope.searchCriteria);
            };

            //重置查询条件
            $scope.resetSearch = function(){
                //用于记录下此时间点的查询条件
                for(var key in $scope.searchCriteria){
                    $scope.searchCriteria[key] = "";
                }
            };

            //详细页是否最大化窗口
            $scope.isDetailPanelMax = false;

            //切换详细页最大化最大化窗口
            $scope.toggleDetailPanelMax = function(){
                $scope.isDetailPanelMax = ! $scope.isDetailPanelMax;
            };


            //查询订单函数
            $scope.orderTableParams = new TableParams({
                page: 1,
                count: 20
            }, {
                counts: [ 20, 50, 100],
                total: 0,
                getData: function ($defer, params) {
                    //获得订单列表
                    //暂时不做服务器多页排序
                   /* if(params.sorting()){
                        var orderBy = "";
                        var orderByArray = params.orderBy();
                        for(var index in orderByArray){
                            var item = orderByArray[index];
                            orderBy += item.substr(1,item.length) + " " + (item[0] == "+"?"asc": "desc");
                        }
                        $scope.searchCriteria.orderBy = orderBy;
                    }*/
                    //=========构造查询条件 start =========
                    var postData = angular.copy($scope.searchCriteriaSaved);
                    //页码
                    postData.pageIndex = params.page();
                    //每页多少条
                    postData.pageSize = params.count();
                    if(postData.createTimeBegin){
                        postData.createTimeBegin = moment(postData.createTimeBegin).format('YYYY-MM-DD') + " 00:00:00";
                    }
                    if(postData.createTimeEnd){
                        postData.createTimeEnd = moment(postData.createTimeEnd).format('YYYY-MM-DD') + " 23:59:59";
                    }
                    //=========构造查询条件 end =========

                    OrderResource.query(postData).$promise.then(function (resp) {
                        params.total(resp.query.totalRecord);

                        $scope.orderList = resp.models;
                        var orderedData = (params.sorting() && (params.orderBy().length > 0)) ? $filter('orderBy')($scope.orderList, params.orderBy()) : $scope.orderList;

                        if($gbSetting.isMockEnv) {

                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }else{
                            $defer.resolve(orderedData);
                        }
                    });


                }
            });


            //获得订单信息函数
            $scope.showDetail = function (orderId) {

                $scope.isDetailPanelMax = true;
                $scope.currOrder = null;
                $scope.currencySymbol = null;
                $scope.shipments = null;
                $scope.payments = null;
                $scope.comments = null;

                //获得订单主要信息
                OrderResource.get({id: orderId}).$promise.then(function (resp) {
                    $scope.currOrder = resp.model;

                    $scope.currencySymbol = orderConstants.currencies[$scope.currOrder.currencyId];
                });

                //获得订单发货信息
                OrderResource.getShipment({id: orderId}).$promise.then(function (resp) {
                    $scope.shipments = resp.models;

                });
                //获得订单支付信息
                OrderResource.getPayment({id: orderId}).$promise.then(function (resp) {
                    $scope.payments = resp.models;

                });
                //获得订单评论信息
                OrderResource.getComment({id: orderId}).$promise.then(function (resp) {
                    $scope.comments = resp.models;
                });
            };

            // -- 快捷键
            hotkeys.add({
                combo: 'esc',
                description: '关闭详细页',
                callback: function() {
                    $scope.isDetailPanelMax = false;
                }
            });

            $scope.$on('fetchRefresh', function() {
                $scope.orderTableParams.reload();
            });

            /**
             * 将日期对象转换为 yyyy-MM-dd 格式字符串
             * @param date
             */
            function getDateString(date){
                var str = "";
                str += date.getFullYear() +"-";
                str += (date.getMonth()+1) +"-";
                str += date.getDay() +" ";
                str += date.getHours() +" ";

            }




        }

    ]);

/**
 * @component: controller
 * @name: main.other
 * @Stability:
 * @description: 事例
 * @author: xbird
 */

angular.module('main.other', [])
  .controller('mainOtherCtrl', ['$scope', function($scope) {
      'use strict';

      $scope.$emit('activeMenu', 'other');

  }]);

/**
 * @component: directive
 * @name: fly.directives.adaptation
 * @Stability: experimental
 * @description: 自适应显示器的大小
 * @author: xbird
 */

angular.module('fly.directives.adaptation', [])
  .directive('adaptation', ['$cookies', function($cookies) {
    'use strict';

    var link = function(scope, element, attrs) {
      var viewHeight = angular.element(window).height(),
          viewWidth = angular.element(window).width(),
          cookieHeight = $cookies.cookieHeight,
          cookieWidth = $cookies.cookieWidth;

      if (cookieHeight) {
        cookieHeight = viewHeight > cookieHeight ? viewHeight : cookieHeight;
        cookieWidth = viewWidth > cookieWidth ? viewWidth : cookieWidth;
      } else {
        cookieHeight = viewHeight;
        cookieWidth = viewWidth;
      }
      $cookies.cookieHeight = cookieHeight;
      // $cookies.cookieWidth = cookieWidth;

      element.css({
        height: cookieHeight
        // width: cookieWidth
      });
    };

    return {
      restrict: 'A',
      link: link
    };
  }]);

angular.module('gb.directives.copyright', [])
  .directive('copyright', function() {
    'use strict';

    return function (scope, elm, attrs) {
      var copyright = "©2014 www.feifei.com IT deparment"; //版权信息
      elm.text(copyright);
    };

  });

/**
 * @component: directive
 * @name: gb.directives.dashboard
 * @Stability:
 * @description: 仪表盘事件注册
 * @author: xbird
 */

angular.module('gb.directives.dashboard', [])

  // 工单表单指令
  .directive('operateTask', [function() {
    'use strict';

    var link = function link(scope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();

        var action = iAttrs.operateTask;
        if (!action) return false;
        scope.$emit('operateTask', action);
      });
    };

    return {
      restrict: 'A',
      replace: false,
      transclude: false,
      link: link
    };

  }])

  .directive('addAlarm', [function() {
    'use strict';

    var link = function(scope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();
        var action = iElement.data('action');
        if (action === 'showAlarm') {
          iElement.data('action', 'hideAlarm');
          iElement.text('关闭提醒...');
        } else {
          iElement.data('action', 'showAlarm');
          iElement.text('添加提醒...');
        }
        scope.$emit('showAlarm', action);
      });
    };

    return {
      restrict: 'AE',
      link: link
    };

  }]);

/**
 * @description: Directives 集合器
 *               所有需要注入app的directive，都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 */

angular.module('greenbird.directives', [
  'fly.directives.example',
  'fly.directives.tabs',
  'fly.directives.greedy',
  'fly.directives.adaptation',
  'fly.directives.form',
  'gb.directives.copyright',
  'gb.directives.loginForm',
  'gb.directives.header',
  'gb.directives.sidebar',
  'gb.directives.dashboard',
  'gb.directives.mytasks',
  'gb.directives.order',
  'gb.directives.table'
]);

/**
 * @Desciption: 指令事例
 * var myModule = angular.module('...', [....]);
 * myModule.directive('namespaceDirectiveName', function() {
 *   return {
 *     restrict: 'A/E/C/M',
 *     priority: number,
 *     template: string,
 *     templateUrl: string,
 *     replace: bool,
 *     transclude: bool,
 *     scope: bool/object,
 *     require: string,
 *     controller: function($scope, $element, $attrs, $transclude) {},
 *     link: function(iScope, iElement, iAttrs) {},
 *     compile: function(tElement, tAttrs, transclude) {}
 *   }
 * })
 */
angular.module('fly.directives.example', [])
  // .directive('hello', [function() {
  //   return {
  //     restrict: 'E',
  //     replace: true,
  //     template: '<div>Hello World!</div>'
  //   };
  // }]);
  //----------------------------------------------
  // .directive('hello', [function() {
  //   return {
  //     restrict: 'E',
  //     replace: true,
  //     templateUrl: 'dest/template/example/hello.html'
  //   };
  // }]);
  //----------------------------------------------
  // .directive('hello', [function() {
  //   return {
  //     restrict: 'E',
  //     replace: true,
  //     templateUrl: 'helloTemplateInline.html'
  //   };
  // }]);
  //----------------------------------------------
  // .directive('hello', [function() {
  //   return {
  //     restrict: 'E',
  //     transclude: true,
  //     template: '<div>Hello <span ng-transclude></span></div>'
  //   };
  // }]);
  //----------------------------------------------
  .directive('hello', [function() {
    return {
      restrict: 'E',
      scope: {
        who: '@expanderWho'
      },
      transclude: true,
      replace: true,
      template: '<div>Hello {{who}} !!</div>',
      link: function(scope, element, attrs) {
        console.log(element.scope());
      }
    };
  }]);
angular.module('fly.directives.form', [])

  /**
   * @description: 自定义select下拉框
   *
   * @usage:
      指令：fly-select，定义下拉筐
      指令：fly-option，定义选项
      数据：data-filter，指定过滤器
      <select fly-select ng-model="" data-filter="">
        <option fly-option value="1">已完成</option>
        <option fly-option value="2">未完成</option>
      </select>
   *
   * @author: xbird
   */
  .directive('flySelect', [function() {

    var bind,
        model,
        filter,
        source;

    // 需要先对模版编译
    var compile = function(tElement, tAttrs, transclude) {
      var i, len, attrsTmp;

      model  = bind = tElement.attr('ng-model');
      filter = tElement.data('filter');
      source = tElement.data('source');

      tElement.removeAttr('ng-model');
      if (model) {
        angular.element('.select-value', tElement).attr('ng-model', model);
        if (filter) {
          bind += ' | ' + filter;
        }
        angular.element('.select-showbox', tElement).attr('ng-bind', bind);
      }

      var postLink = function postLink(scope, iElement, iAttrs) {
        angular.element('.select-showbox', iElement).on('click', function() {
          if (iAttrs.disabled) return false; // 当有disabled属性时点击不可用
          scope.isShow = !scope.isShow;
          scope.$saferApply();
        });
      };

      var preLink = function preLink(scope, iElement) {
        var contentTmp = '';

        if (!source) return;
        // contentTmp = '<option fly-option value="" ng-repeat="item in ' + source + '" >{{item.faces}}</option>';
        // console.log(contentTmp);

        // console.log(angular.element('.select-options', iElement));


        // angular.element('.select-options', iElement).innerHtml = contentTmp;

        // for (i = 0, len = attrsTmp.length; i < len; i += 1) {
        //   angular.element('.select-options', iElement).append("");
        // }
      };

      // 对编译结果链接
      return {
        pre: preLink,
        post: postLink
      };
    };

    // 定义下拉框自身的控制器
    var controller = function($scope) {
      var i,
          len,
          attrsTmp = model.split('.');

      // 默认设置下拉选项框为隐藏的
      $scope.isShow = false;

      // 默认设置下拉框是否可用
      // TODO
      $scope.isDisabled = true;

      // 设置下拉框的值
      this.setValue = function(value) {
        var valTmp = $scope,
            lastAttr;

        // 由于ng-model的值可能为多级链接(taskForm.status.value)，这时需要想办法提出来
        for (i = 0, len = attrsTmp.length - 1; i < len; i += 1) {
          valTmp = valTmp[attrsTmp[i]];
        }

        lastAttr = attrsTmp[attrsTmp.length - 1];
        valTmp[lastAttr] = value;
        $scope.$saferApply();
      };

      // 设置下拉选项栏的可见状态
      this.showOptions = function(isShow) {
        $scope.isShow = isShow;
      };
    };

    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      scope: true,
      controller: controller,
      templateUrl: 'dest/template/form/select.html',
      compile: compile
    };
  }])
  /**
   * @description: 定义下拉选项
      点击选项时，包括设置下拉框的新值和隐藏下拉选项框
   *
   * @usage:
      <option fly-option value="2">XXX</option>
   *
   * @author: xbird
   */
  .directive('flyOption', [function() {

    var link = function(scope, element, attrs, ctrl) {
      element.on('click', function(e) {
        e.preventDefault();
        ctrl.showOptions(false); // 隐藏下拉选项
        ctrl.setValue(element.attr('value')); // 设置选项框的值
      });
    };

    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      require: '^?flySelect',
      template: '<li ng-transclude class="select-option"></li>',
      link: link
    };
  }]);
/**
 * @component: directive
 * @name: fly.directives.greedy
 * @stability:
 * @description: 将DOM布局想象成一个个的盒子，
 *  greedy指令，用于贪婪的拉伸垂直高度，直至在整个垂直方向将整个父容器挤满
 * @author: xbird
 */

angular.module('fly.directives.greedy', [])
    .directive('greedy', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var parentElement = element.parent(),
                    totalHeight = 0;
                angular.forEach(angular.element(parentElement).children(), function (node, key) {
                    totalHeight += angular.element(node).outerHeight();
                });
                totalHeight -= angular.element(element).outerHeight();
                element.css('height', parentElement.innerHeight() - totalHeight);
            }
        };
    })
/**
 * Usage:贪婪设置div 高度，
 * param: width 是已知的已占高度
 */
    .directive('greedyEat', [function (width) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(angular.isDefined(attrs.greedyEat) && attrs.greedyEat !==""){
                    element.css('height', document.body.clientHeight - attrs.greedyEat);
                }else{
                    //do nothing
                }
            }
        };
    }])

;



/**
 * @component: directive
 * @name: gb.directives.header
 * @stability:
 * @description: 全局搜索控件
 * @author: xbird
 */

angular.module('gb.directives.header', [])

  // 全局搜索
  .directive('globalSearch', [function() {
    'use strict';

    var link = function(iScope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();

        iScope.$emit('forwardingEvent', 'globalSearch', iScope.searchInput);
      });
    };

    return {
      restrict: 'A',
      link: link
    };

  }])
  // 用户登出
  .directive('userLogout', [function() {
    'use strict';

    var link = function(iScope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();

        iScope.$emit('logout');
      });
    };

    return {
      restrict: 'A',
      link: link
    };

  }])
  // 查看提示
  .directive('hangUp', [function() {
    'use strict';

    var link = function(scope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();
        scope.$emit('hangUp');
      });
    };

    return {
      restrict: 'A',
      link: link
    };

  }]);

/**
 * @component: directive
 * @name：gb.directives.loginForm
 * @stability:
 * @description: 用户登录控件
 * @author： hcz
 */

var USERNAME_REGEXP = /[a-zA-Z][a-zA-Z0-9]{3,}/;
var PASSWORD_REGEXP = /[a-zA-Z0-9]{6,}/;
angular.module('gb.directives.loginForm', [])
  .directive('userDoLogin', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        angular.element(element).on('click', function (e) {
          e.preventDefault();

          var form = angular.element('form'),
              warning = angular.element('#warningText');

          // 判断输入是否为空
          if (!scope.user || !scope.user.userName) {
            warning.text('账号或密码不能为空');
            return;
          }


          var isUserName = USERNAME_REGEXP.test(scope.user.userName),
              ispwd = PASSWORD_REGEXP.test(scope.user.password);

          if ( !isUserName && ispwd) {
            warning.text('账号格式不正确');
            form.find('.username').addClass('inputError');
            return; 
          } 
          if ( !ispwd && isUserName) {
            warning.text('密码格式不正确');
            form.find('.password').addClass('inputError');
            return;
          }
          if (!isUserName && !ispwd) {
            warning.text('账号和密码格式不正确，请重新输入');
            form.find('.username').addClass('inputError');
            form.find('.password').addClass('inputError');
          }
          scope.$emit('doLogin', scope.user);
        });
      }
    };
  })
  .directive('inputClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {
        angular.element(element).on('click', function (e) {
          e.preventDefault();
          angular.element('.errorText').hide();    //去掉账号为空的提示
          var userName = angular.element('.username'),
              userPassword = angular.element('.password');

          // 改变输入错误时的输入框样式
          angular.element('#warningText').text('');
          if (userName.hasClass('inputError') && userName.is(':focus')) {
            userName.removeClass('inputError');
          }
          if (userPassword.hasClass('inputError') && userPassword.is(':focus')) {
            userPassword.removeClass('inputError');
          }
        });
      }
    };
  });


/**
 * @component: directive
 * @name: gb.directives.mytasks
 * @Stability:
 * @description: 我的工单事件注册
 * @author: xbird
 */

angular.module('gb.directives.mytasks', [])

  .directive('mtAddAlarm', [function() {
    'use strict';

    var link = function(scope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();
        var action = iElement.data('action');
        if (action === 'showAlarm') {
          iElement.data('action', 'hideAlarm');
          iElement.text('关闭提醒...');
        } else {
          iElement.data('action', 'showAlarm');
          iElement.text('添加提醒...');
        }
        scope.$emit('mtShowAlarm', action);
      });
    };

    return {
      restrict: 'AE',
      link: link
    };

  }]);

/**
 * @component: directive
 * @name: gb.directives.table
 * @Stability:
 * @description: 表格
 * @author: xbird, Patrick
 */

angular.module('gb.directives.order', [])
    .directive('ordersTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/order/list.html'
        };
    }])
    .directive('orderDetail', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/order/detail.html'
        };
    }]);
/**
 * @component: directive
 * @name: gb.directives.sidebar
 * @Stability:
 * @description: 侧边栏生成和点击事件注册
 * @author: xbird
 */

angular.module('gb.directives.sidebar', [])
  /**
   * @description: 侧边栏wrapped
   */
  .directive('menubar', [function() {

    return {
      restrict: 'AE',
      replace: true,
      transclude: true,
      template: '<ul ng-transclude></ul>'
    };
  }])

  /**
   * @description: 菜单栏实例，并实现点击事件
   */
  .directive('menu', [function(appConfigurator) {
    var link = function(scope, iElement, iAttrs) {
      iElement.on('click', function(e) {
        e.preventDefault();

        // 触发保存上下文事件
        scope.$emit('forwardingEvent', 'saveContext', '');
      });
    };

    return {
      restrict: 'AE',
      replace: true,
      transclude: true,
      template: '<li ng-class="{active: menu.id == activedMenu.id}"><div class="icon"></div><span>{{menu.name}}</span></li>',
      link: link
    };
  }]);
/**
 * @component: directive
 * @name: gb.directives.table
 * @Stability:
 * @description: 表格
 * @author: xbird, Patrick
 */

angular.module('gb.directives.table', [])
    .directive('allsmsTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/allsms.html'
        };
    }])
    .directive('alltasksTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/alltasks.html'
        };
    }])
    .directive('mytasksTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/mytasks.html'
        };
    }])
    .directive('singleTask', [function () {
        'use strict';

        var link = function (scope, element, attrs) {

            // 单击单条记录，显示交互信息
            element.on('click', function () {
                element.siblings('tr').removeClass('active');
                element.addClass('active');
                scope.$emit('selectSingleTask', scope.task);
            });

            // 对单条记录操作
            element.on('click', '.operate', function (e) {
                e.preventDefault();

                var keys = ['taskCode', 'emergent', 'name', 'phone', 'email', 'businessCode', 'currentOwner', 'status', 'type', 'content', 'submit', 'assignedGroup', 'assignedOwner', 'involve'],
                    method = angular.element(this).data('method'),
                    data = {},
                    len,
                    i;

                // 对需要发出去的数据打包
                for (i = 0, len = keys.length; i < len; i += 1) {
                    var keyTmp = keys[i];

                    data[keyTmp] = {};
                    data[keyTmp].value = scope.task.taskVo[keyTmp] || '';
                }

                data.involve.value = '1'; // 这是个hack
                data.status.value = '1'; // 这是个hack

                scope.$emit('operateSingleTask', method, angular.copy(data));
            });

        };

        return {
            restrict: 'A',
            replace: true,
            link: link
        };
    }]);
/**
 * @component: directive
 * @name: fly.directives.tabs
 * @Stability:
 * @description: 标签页控件
 *    源码出自 Bootstrap UI，经过适当的修改适应项目
 * @author: xbird
 */

angular.module('fly.directives.tabs', [])
  .controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
    var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

    ctrl.select = function(selectedTab) {
      angular.forEach(tabs, function(tab) {
        if (tab.active && tab !== selectedTab) {
          tab.active = false;
          tab.onDeselect();
        }
      });
      selectedTab.active = true;
      selectedTab.onSelect();
    };

    ctrl.addTab = function addTab(tab) {
      tabs.push(tab);
      // we can't run the select function on the first tab
      // since that would select it twice
      if (tabs.length === 1) {
        tab.active = true;
      } else if (tab.active) {
        ctrl.select(tab);
      }
    };

    ctrl.removeTab = function removeTab(tab) {
      var index = tabs.indexOf(tab);
      //Select a new tab if the tab to be removed is selected
      if (tab.active && tabs.length > 1) {
        //If this is the last tab, select the previous tab. else, the next tab.
        var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
        ctrl.select(tabs[newActiveIndex]);
      }
      tabs.splice(index, 1);
    };
  }
])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab heading="Tab 1"><b>First</b> Content!</tab>
      <tab heading="Tab 2"><i>Second</i> Content!</tab>
    </tabset>
    <hr />
    <tabset vertical="true">
      <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
      <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
    </tabset>
    <tabset justified="true">
      <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
      <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
    </tabset>
  </file>
</example>
 */
.directive('tabset', function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    scope: {
      type: '@',
      greedyEatHeight : '='
    },
    controller: 'TabsetController',
    templateUrl: 'dest/template/tabs/tabset.html',
    link: function(scope, element, attrs) {
      scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
      scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <div ng-controller="TabsDemoCtrl">
      <button class="btn btn-small" ng-click="items[0].active = true">
        Select item 1, using active binding
      </button>
      <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
        Enable/disable item 2, using disabled binding
      </button>
      <br />
      <tabset>
        <tab heading="Tab 1">First Tab</tab>
        <tab select="alertMe()">
          <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
          Second Tab, with alert callback and html heading!
        </tab>
        <tab ng-repeat="item in items"
          heading="{{item.title}}"
          disabled="item.disabled"
          active="item.active">
          {{item.content}}
        </tab>
      </tabset>
    </div>
  </file>
  <file name="script.js">
    function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
  </file>
</example>
 */

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab>
        <tab-heading><b>HTML</b> in my titles?!</tab-heading>
        And some content, too!
      </tab>
      <tab>
        <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
        That's right.
      </tab>
    </tabset>
  </file>
</example>
 */
.directive('tab', ['$parse',
  function($parse) {
    return {
      require: '^tabset',
      restrict: 'EA',
      replace: true,
      templateUrl: 'dest/template/tabs/tab.html',
      transclude: true,
      scope: {
        active: '=?',
        heading: '@',
        onSelect: '&select', //This callback is called in contentHeadingTransclude
        //once it inserts the tab's content into the dom
        onDeselect: '&deselect'
      },
      controller: function() {
        //Empty controller so other directives can require being 'under' a tab
      },
      compile: function(elm, attrs, transclude) {
        return function postLink(scope, elm, attrs, tabsetCtrl) {
          // console.log(scope);
          scope.$watch('active', function(active) {
            if (active) {
              tabsetCtrl.select(scope);
            }
          });

          scope.disabled = false;
          if (attrs.disabled) {
            scope.$parent.$watch($parse(attrs.disabled), function(value) {
              scope.disabled = !! value;
            });
          }

          scope.select = function() {
            if (!scope.disabled) {
              scope.active = true;
            }
          };

          tabsetCtrl.addTab(scope);
          scope.$on('$destroy', function() {
            tabsetCtrl.removeTab(scope);
          });

          //We need to transclude later, once the content container is ready.
          //when this link happens, we're inside a tab heading.
          scope.$transcludeFn = transclude;
        };
      }
    };
  }
])

.directive('tabHeadingTransclude', [

  function() {
    return {
      restrict: 'A',
      require: '^tab',
      link: function(scope, elm, attrs, tabCtrl) {
        scope.$watch('headingElement', function updateHeadingElement(heading) {
          if (heading) {
            elm.html('');
            elm.append(heading);
          }
        });
      }
    };
  }
])

.directive('tabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^tabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.tabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };

  function isTabHeading(node) {
    return node.tagName && (
      node.hasAttribute('tab-heading') ||
      node.hasAttribute('data-tab-heading') ||
      node.tagName.toLowerCase() === 'tab-heading' ||
      node.tagName.toLowerCase() === 'data-tab-heading'
    );
  }
});
/**
 * @description: Filters 集合器
 *               所有需要注入app的filter都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('greenbird.filters', [
  'gb.task.filters',
  'gb.order.filters'
]);

/**
 * @description: Order filters
 *
 * @author: Patrick.he
 **/

angular.module('gb.order.filters', [])
    //-- 订单状态
    .filter('orderStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.statuses[value];
        };
    }])
    //-- 销售渠道
    .filter('orderChannel', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.channels[value];
        };
    }])
    //-- 监控状态
    .filter('orderHealthStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.healthStatuses[value];
        };
    }])
    //-- 货币
    .filter('orderCurrency', ['orderConstants', '$filter', '$sce', function (orderConstants, $filter, $sce) {
        return function (amount, currencyId) {
              var symbol = orderConstants.currencyIcons[currencyId];
              if(angular.isUndefined(symbol) || null === amount || "" === amount){
                  return "";
              }else{
                  if(symbol.indexOf("fa-")>=0){
                      return $sce.trustAsHtml('<i class="fa '+ symbol+'"></i> ' + $filter('currency')(amount, "") );
                  }else{
                      return $filter('currency')(amount, symbol  + " ") ;
                  }

              }
        };
    }])
    //-- 发货类型
    .filter('orderShippingType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingTypes[value];
        };
    }])
    //-- 订单类型
    .filter('orderType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.orderTypes[value];
        };
    }])
    //-- 支付状态
    .filter('orderPaymentStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.paymentStatuses[value];
        };
    }])
    //-- 支付事务类型
    .filter('orderPaymentTransactionType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.paymentTransactionTypes[value];
        };
    }])
    //-- 运输类型
    .filter('orderShippingMethod', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingMethods[value];
        };
    }])
    //-- 运输状态
    .filter('orderShippingStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingStatuses[value];
        };
    }])

;


/**
 * @description: Task filters
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('gb.task.filters', [])

  // 状态（完成，未完成）
  .filter('taskStatus', [function() {
    return function(value) {
      var mapping = {
        '1': '已完成',
        '2': '未完成'
      };
      return mapping[value];
    };
  }])

  // 程度（一般，紧急）
  .filter('taskEmergent', [function() {
    return function(value) {
      var mapping = {
        '1': '一般',
        '2': '紧急'
      };
      return mapping[value];
    };
  }])

  // 类型（产品咨询，订单受理，退换货）
  .filter('taskType', [function() {
    return function(value) {
      var mapping = {
        '1': '活动及政策',
        '2': '商城展示',
        '3': '订单需求',
        '4': '配送问题',
        '5': '漏发',
        '6': '退换货',
        '7': '发票',
        '8': '退款',
        '9': '其他'
      };
      return mapping[value];
    };
  }])

  // 介入
  .filter('remarkCreateMethod', [function() {
    return function(value) {
      var mapping = {
        '0': '跟进',
        '1': '介入',
        '2': '提醒'
      };
      return mapping[value];
    };
  }])

  // 指派组别
  .filter('assignedGroup', [function() {
    return function(value) {
      var mapping = {
        '0': '自己',
        '1': '退换货组',
        '2': '产品咨询组',
        '3': '物流跟踪组'
      };
      return mapping[value];
    };
  }])

  // 介入
  .filter('involve', [function() {
    return function(value) {
      var mapping = {
        '1': '介入'
      };
      return mapping[value];
    };
  }]);

angular.module('fly.module.modal', ['fly.module.transition'])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'dest/template/modal/backdrop.html',
      link: function (scope) {

        scope.animate = false;

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@',
        animate: '='
      },
      replace: true,
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'dest/template/modal/window.html';
      },
      link: function (scope, element, attrs) {
        element.addClass(attrs.windowClass || '');
        scope.size = attrs.size;

        $timeout(function () {
          // trigger CSS transitions
          scope.animate = true;
          // focus a freshly-opened modal
          element[0].focus();
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
    function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance) {

        var body = $document.find('body').eq(0);
        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
          modalWindow.modalScope.$destroy();
          body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
          checkRemoveBackdrop();
        });
      }

      function checkRemoveBackdrop() {
          //remove backdrop if no longer needed
          if (backdropDomEl && backdropIndex() == -1) {
            var backdropScopeRef = backdropScope;
            removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
              backdropScopeRef.$destroy();
              backdropScopeRef = null;
            });
            backdropDomEl = undefined;
            backdropScope = undefined;
          }
      }

      function removeAfterAnimate(domEl, scope, emulateTime, done) {
        // Closing animation
        scope.animate = false;

        var transitionEndEventName = $transition.transitionEndEventName;
        if (transitionEndEventName) {
          // transition out
          var timeout = $timeout(afterAnimating, emulateTime);

          domEl.bind(transitionEndEventName, function () {
            $timeout.cancel(timeout);
            afterAnimating();
            scope.$apply();
          });
        } else {
          // Ensure this call is async
          $timeout(afterAnimating, 0);
        }

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          domEl.remove();
          if (done) {
            done();
          }
        }
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            evt.preventDefault();
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key, 'escape key press');
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var body = $document.find('body').eq(0),
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          backdropDomEl = $compile('<div modal-backdrop></div>')(backdropScope);
          body.append(backdropDomEl);
        }

        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr({
          'template-url': modal.windowTemplateUrl,
          'window-class': modal.windowClass,
          'size': modal.size,
          'index': openedWindows.length() - 1,
          'animate': 'animate'
        }).html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);
        body.addClass(OPENED_MODAL_CLASS);
      };

      $modalStack.close = function (modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismissAll = function (reason) {
        var topModal = this.getTop();
        while (topModal) {
          this.dismiss(topModal.key, reason);
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                windowClass: modalOptions.windowClass,
                windowTemplateUrl: modalOptions.windowTemplateUrl,
                size: modalOptions.size
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });

/**
 * @description:
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('greenbird.module', [
  'fly.module.modal'
]);

angular.module('fly.module.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

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
/**
 * @component: Constructor
 * @name: gb.constructor
 * @Stability:
 * @description: Constructor collection
 * @author: xbird
 */

angular.module('greenbird.constructor', [])

  .factory('TaskForm', [function () {
    'use strict';

    // task 表单的状态记录，包括数据和行为
    // 每一个表单控件包括value(值)、disabled(true:disabled, false:normal)和invisible
    var TaskForm = function TaskForm() {

      this.reset(arguments[0]);
    };

    TaskForm.prototype.reset = function() {

      var opt = arguments[0] || {};

      // Set value
      this.taskCode       = opt.taskCode        || { value: '',  disabled: false, invisible: false };   // 工单号
      this.name           = opt.name            || { value: '',  disabled: false, invisible: false };   // 昵称
      this.phone          = opt.phone           || { value: '',  disabled: false, invisible: false };   // 电话
      this.email          = opt.email           || { value: '',  disabled: false, invisible: false };   // 邮箱
      this.businessCode   = opt.businessCode    || { value: '',  disabled: false, invisible: false };   // 单号
      this.status         = opt.status          || { value: 1, disabled: false, invisible: false };   // 完成状态，默认值已完成
      this.involve        = opt.involve         || { value: 1, disabled: false, invisible: true };    // 介入
      this.type           = opt.type            || { value: 1, disabled: false, invisible: false };   // 工单类型，默认值为1
      this.emergent       = opt.emergent        || { value: 1, disabled: false, invisible: false };   // 紧急状态，默认值一般
      this.remarkLabel    = opt.remarkLabel     || { value: '',  disabled: false, invisible: false };   //
      this.content        = opt.content         || { value: '',  disabled: false, invisible: false };   // 备注说明
      this.alertTime      = opt.alertTime       || { value: '0000-00-00 00:00:00',  disabled: true, invisible: false };   // 提醒时间
      this.assignedGroup  = opt.assignedGroup   || { value: '', disabled: false, invisible: true };  // 指派组
      this.assignedOwner  = opt.assignedOwner   || { value: '', disabled: false, invisible: true };  // 指派成员
      this.submit         = opt.submit          || { action: 'create', disabled: true, invisible: true }; //
    };

    /**
     * @Description: Set value
     * @Usage:
        instance.set(name, value);                              Set one value
        instance.set({ name: { value: ''[, status: ''...] } }); Set a set of value and property
     *
     * @Return: this
     */
    TaskForm.prototype.set = function() {
      var fParam = arguments[0],
          sParam = arguments[1],
          that = this;

      if (!fParam) { return this; }

      // 区分参数类型
      if (typeof fParam === 'object') {
        angular.forEach(fParam, function(value, key) {
          that[key] = value;
        });
      } else {
        // console.log(this[fParam].value);
        this[fParam].value = sParam || '';
      }
      return this;
    };

    /**
     * @Description: Get value
     * @Usage:
        instance.get();                 Get all value
        instance.get(name);             Get one value
        instance.get(name, [name...]);  Get a set of value
     *
     * @Return: Plain object
     */
    TaskForm.prototype.get = function() {

      var fParam = arguments[0],
          result = {},
          len,
          i;

      // 根据参数类型，获取相应的值
      if (!fParam) {
        for(i in this) {
          if (this.hasOwnProperty(i)) {
            result[i] = this[i].value;
          }
        }
      } else {
        for (i = 0, len = arguments.length; i < len; i += 1 ) {
          var nameTmp = arguments[i];
          result[nameTmp] = this[nameTmp].value;
        }
      }
      return result;
    };

    return TaskForm;

  }]);
/**
 * @component:
 * @name: gb.services.contextService
 * @Stability:
 * @description:
 * @author: xbird
 */

var app = angular.module('gb.services.contextService', []);

  /**
   * 保存上下文
   */
  app.factory('contextService', ['Context', function(Context) {
    'use strict';

    var _context_ = [],
        _current_ = null,
        contextService = {};

    contextService.push = function push(context) {
      _context_.push(context);
    };

    contextService.pop = function pop() {
      _current_ = _context_.pop();
      return _current_;
    };

    contextService.list = function list() {
      return _context_;
    };

    contextService.create = function create() {
      var tmpContext = new Context();

      // tmpContext.allTasksPage = [];

      if (_current_ && _current_ instanceof Context) {
        _context_.push(_current_);
      }
      _current_ = tmpContext;
    };

    contextService.current = function() {
      return _current_;
    };

    contextService.get = function(key) {
      return _current_.get(key);
    };

    contextService.set = function(key, value) {
      return _current_.set(key, value);
    };

    return contextService;
  }]);

  /**
   * 上下文对象
   */
  app.factory('Context', [function() {
    var Context = function() {};

    Context.prototype.get = function(key) {
      return this[key] || null;
    };

    Context.prototype.set = function(key, value) {
      if (arguments.length < 2) return;
      this[key] = value;
    };

    return Context;
  }]);
/**
 * @component: service
 * @name: gb.services.orderService
 * @description:
 * @author: Patrick
 * @creat on: 2014/6/29.
 */
angular.module('gb.services.orderService',[])
    .factory('OrderResource', ['$resource','$gbSetting',
        function($resource, $gbSetting){

        var orderResource;
        if($gbSetting.isMockEnv){
            orderResource =  $resource('/mock/order/orders.json',{id:'@id'},
                {
                    'query':  {method:'GET', isArray:false},
                    'get':  {url :'/mock/order/:id/main.json' },
                    'getShipment':  {url :'/mock/order/:id/shipments.json' },
                    'getPayment':  {url :'/mock/order/:id/payment.json' },
                    'getComment':  {url :'/mock/order/:id/comment.json' }
                }
            );
        }else{
            orderResource =  $resource('/salesOrder/search',{id:'@id'},
                {
                    'query':  {method:'POST', isArray:false},
                    'get':  {url :'/salesOrder/:id' },
                    'getShipment':  {url :'/salesOrder/:id/shipment' },
                    'getPayment':  {url :'/salesOrder/:id/payment' },
                    'getComment':  {url :'/salesOrder/:id/comment' }
                }
            );
        }
        return orderResource;
    }]);

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
/**
 * @description: Services 集合器
    所有需要注入app的service都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('greenbird.services', [
  'gb.services.smsService',
  'gb.services.rolesService',
  'gb.services.userService',
  'gb.services.taskService',
  'gb.services.configService',
  'gb.services.contextService',
  'gb.services.orderService'
])

  /**
   * @description: app配置器
   */
  .factory('appConfigurator', [function() {

    // 状态namaspace，状态是搜索时的凭证，状态需要手动添加
    var _status = {
      '_acitvedMenuID': '',
      '_userid': '',
      '_username': '',
      '_searchInput': ''
    };

    return {
      /**
       * @description: 设置状态，不可设置不存在的状态
       *
       * @param: status <string> 状态名
       *         val    <all>    状态值
       * @return: this <object>  对象自身 可进行链式操作
       */
      setStatus: function(status, val) {
        if (_status[status] === undefined) {
          return false;
        }
        _status[status] = val || '';
        return this;
      },
      /**
       * @description: 获取状态
       *
       * @param: status <string> 状态名
       * @retuen:       <all || undefined> 状态值
       */
      getStatus: function(status) {
        return _status[status];
      }
    };
  }]);
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