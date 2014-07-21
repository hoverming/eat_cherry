angular.module('logout', [])
  .controller('logoutCtrl', ['$location', '$scope', '$gbSetting', function($location, $scope, $gbSetting) {
    window.location.href = $gbSetting.loginAddress + '/login.htm?action=loginAction&eventSubmitDoLogout=yes';
  }]);
