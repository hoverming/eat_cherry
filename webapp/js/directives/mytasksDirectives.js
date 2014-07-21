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
