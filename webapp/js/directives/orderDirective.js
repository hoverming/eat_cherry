/**
 * @component: directive
 * @name: gb.directives.table
 * @Stability:
 * @description: 表格
 * @author: xbird, Patrick
 */

angular.module('gb.directives.order', [])
    .directive('ordersTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/order/list.html'
        };
    }])
    .directive('orderDetail', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'partials/order/detail.html'
        };
    }]);