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
