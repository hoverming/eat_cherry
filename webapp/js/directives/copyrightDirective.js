angular.module('gb.directives.copyright', [])
  .directive('copyright', function() {
    'use strict';

    return function (scope, elm, attrs) {
      var copyright = "©2014 www.feifei.com IT deparment"; //版权信息
      elm.text(copyright);
    };

  });
