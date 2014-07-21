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
