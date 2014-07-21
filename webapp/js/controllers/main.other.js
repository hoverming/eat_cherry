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
