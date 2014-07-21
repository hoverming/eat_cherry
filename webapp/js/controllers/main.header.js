/**
 * @component: controller
 * @name: main.header
 * @Stability:
 * @description: main页头部
 * @author: xbird
 */

angular.module('main.header', [])

  .controller('mainHeaderCtrl', [
    '$scope',
    '$modal',
    '$state',
    '$log',
    'UserResource',
    'appConfigurator',
    function($scope, $modal, $state, $log, UserResource, appConfigurator) {
      'use strict';

      //
      //== 头部事件

      $scope.$on('logout', function() {

        var unlabeledTasks = [],
            unlabeledTaskIds = [];

        UserResource.logout({
          userId: appConfigurator.getStatus('_userid')
        }).$promise.then(function(data) {
          unlabeledTasks = data.data.array;
          for (var i = 0, len = unlabeledTasks.length; i < len; i += 1) {
            unlabeledTaskIds.push(unlabeledTasks[i].taskCode);
          }
          var controller = function($scope, $modalInstance, UserResource) {

            $scope.remain = unlabeledTasks.length;

            $scope.logout = function() {
              UserResource.markByLogout({
                userId: appConfigurator.getStatus('_userid'),
                content: angular.element('.modal-logout textarea').val(),
                taskIds: unlabeledTaskIds
              });
              $modalInstance.dismiss('cancel');
              $state.go('logout');
            };

            $scope.myTasks = function() {
              $modalInstance.dismiss('cancel');
            };
          };

          var modalInstance = $modal.open({
            templateUrl: 'dest/template/modal/logouttips.html',
            controller: controller,
            size: 'sm',
            windowClass: 'modal-warning modal-logout',
          });

          modalInstance.result.then(function () {
            console.log('yes');
          }, function () {
            $log.info('Modal dismissed at: ' + new Date());
          });
        });
      });
    }]);
