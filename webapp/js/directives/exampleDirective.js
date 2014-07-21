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