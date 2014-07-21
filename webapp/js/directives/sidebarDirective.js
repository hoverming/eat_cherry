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