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