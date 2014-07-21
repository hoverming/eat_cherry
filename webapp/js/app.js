/**
 * @component: core
 * @name: greenbird
 * @description:  Declare app level module which depends on filters, and services
 * @author: Patrick
 * @creat on: 2014/6/29.
 */
angular.module('greenbird', [
    'ngTable',
    'ngCookies',
    'ngResource',
    'ui.router',
    'ui.bootstrap.datetimepicker',
    'cfp.hotkeys',
    'greenbird.module',
    'greenbird.constants',
    'greenbird.filters',
    'greenbird.services',
    'greenbird.directives',
    'greenbird.controllers',
    'greenbird.constructor'
])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('loading', { url: '/loading', templateUrl: 'partials/loading.html', controller: 'loadingCtrl' })
                // .state('login', { url: '/login', templateUrl: 'partials/login.html', controller: 'loginCtrl' })
                .state('main', { url: '/main', templateUrl: 'partials/main.html', controller: 'mainCtrl' })
                .state('logout', { url: '/logout', templateUrl: 'partials/logout.html', controller: 'logoutCtrl' })
                .state('main.dashboard', { url: '/dashboard', templateUrl: 'partials/dashboard.html', controller: 'mainDashboardCtrl' })
                .state('main.mytasks', { url: '/mytasks', templateUrl: 'partials/mytasks.html', controller: 'mainMytasksCtrl' })
                .state('main.order', {  url: '/orders', templateUrl: 'partials/orders.html', controller: 'orderCtrl' })
                .state('main.other', { url: '/other', templateUrl: 'partials/other.html', controller: 'mainOtherCtrl' });

            // For any unmatched url, redirect to /loading
            $urlRouterProvider.otherwise("/loading");
        }
    ])
    .factory('myHttpInterceptor', function ($q, $window) {
        return function (promise) {
            return promise.then(function (response) {
                $('#mask').hide();
                return response;

            }, function (response) {
                $('#mask').hide();
                return $q.reject(response);
            });
        };
    })
    .config(['$httpProvider', function ($httpProvider) {

        $httpProvider.responseInterceptors.push('myHttpInterceptor');

        $httpProvider.defaults.transformRequest = function(obj){

            $('#mask').show();
            var str = [];
            for(var p in obj){
                var value = "";
                if(obj[p] !== null ){
                    value = encodeURIComponent(obj[p]);
                }
                str.push(encodeURIComponent(p) + "=" + value);
            }
            return str.join("&");
        };

        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };
    }])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.$saferApply = function (exp) {
            if (!this.$$phase) {
                this.$apply(exp);
            } else {
                try {
                    this.$eval(exp);
                } catch (ex) {
                    $exceptionHandler(ex);
                } finally {
                    this.$digest();
                }
            }
        };
    }]);
