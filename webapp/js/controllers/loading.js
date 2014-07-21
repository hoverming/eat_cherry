

angular.module('loading', [])
  .controller('loadingCtrl', ['$state', '$cookieStore', 'UserResource', function($state, $cookieStore, UserResource) {
    UserResource.login().$promise.then(function(resp) {
      $cookieStore.put('_user_id_', resp.data.userId);
      $cookieStore.put('_user_name_', resp.data.userName);
      $state.go('main.dashboard');
    });
  }]);
