/**
 * @component: controller
 * @name：login
 * @Stability:
 * @description: 登录页面控制器
 * @author：hcz
 */

angular
  .module('login', ['ngCookies'])
  .controller(
    'loginCtrl',
    [
      '$scope',
      '$cookies',
      '$http',
      '$location',
      function ($scope, $cookies, $http, $location) {
        'use strict';

        // $location.path('/main');

        // cookir设置
        var name = $cookies.userName;
        $cookies.userName="ok";

        // 登陆
        var login = function (event, user) {
          angular.module('login', [])
            .controller('loginCtrl', ['$scope', '$http',
              function($scope, $http) {      
                $http({
                  method: 'POST',  
                  url: '/mock/test.json',
                  data: {
                    userName: 'admin',
                    password: '123'
                  }
                })
                .success(function (data, status) {
                  $scope.status = status;
                  $scope.data = data;
                  if ($scope.data.code === $scope.status) {
                    $scope.warningText = '登录成功';
                  }
                })
                .error(function (data, status) {
                  $scope.status = status;
                  $scope.data = data;
                  if ($scope.data.code === $scope.status) {
                    $scope.warningText = '账号或者密码错误，请重新输入';
                  }
                });
              }
            ]
          );
          $scope.$on('doLogin', login);
        };
      }
    ]
  );
