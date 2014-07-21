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
