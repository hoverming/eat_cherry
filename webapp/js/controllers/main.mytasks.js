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
