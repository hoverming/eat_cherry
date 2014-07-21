/**
 * @component: directive
 * @name: gb.directives.table
 * @Stability:
 * @description: 表格
 * @author: xbird, Patrick
 */

angular.module('gb.directives.table', [])
    .directive('allsmsTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/allsms.html'
        };
    }])
    .directive('alltasksTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/alltasks.html'
        };
    }])
    .directive('mytasksTable', [function () {
        'use strict';

        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'dest/template/table/mytasks.html'
        };
    }])
    .directive('singleTask', [function () {
        'use strict';

        var link = function (scope, element, attrs) {

            // 单击单条记录，显示交互信息
            element.on('click', function () {
                element.siblings('tr').removeClass('active');
                element.addClass('active');
                scope.$emit('selectSingleTask', scope.task);
            });

            // 对单条记录操作
            element.on('click', '.operate', function (e) {
                e.preventDefault();

                var keys = ['taskCode', 'emergent', 'name', 'phone', 'email', 'businessCode', 'currentOwner', 'status', 'type', 'content', 'submit', 'assignedGroup', 'assignedOwner', 'involve'],
                    method = angular.element(this).data('method'),
                    data = {},
                    len,
                    i;

                // 对需要发出去的数据打包
                for (i = 0, len = keys.length; i < len; i += 1) {
                    var keyTmp = keys[i];

                    data[keyTmp] = {};
                    data[keyTmp].value = scope.task.taskVo[keyTmp] || '';
                }

                data.involve.value = '1'; // 这是个hack
                data.status.value = '1'; // 这是个hack

                scope.$emit('operateSingleTask', method, angular.copy(data));
            });

        };

        return {
            restrict: 'A',
            replace: true,
            link: link
        };
    }]);