angular.module('fly.directives.form', [])

  /**
   * @description: 自定义select下拉框
   *
   * @usage:
      指令：fly-select，定义下拉筐
      指令：fly-option，定义选项
      数据：data-filter，指定过滤器
      <select fly-select ng-model="" data-filter="">
        <option fly-option value="1">已完成</option>
        <option fly-option value="2">未完成</option>
      </select>
   *
   * @author: xbird
   */
  .directive('flySelect', [function() {

    var bind,
        model,
        filter,
        source;

    // 需要先对模版编译
    var compile = function(tElement, tAttrs, transclude) {
      var i, len, attrsTmp;

      model  = bind = tElement.attr('ng-model');
      filter = tElement.data('filter');
      source = tElement.data('source');

      tElement.removeAttr('ng-model');
      if (model) {
        angular.element('.select-value', tElement).attr('ng-model', model);
        if (filter) {
          bind += ' | ' + filter;
        }
        angular.element('.select-showbox', tElement).attr('ng-bind', bind);
      }

      var postLink = function postLink(scope, iElement, iAttrs) {
        angular.element('.select-showbox', iElement).on('click', function() {
          if (iAttrs.disabled) return false; // 当有disabled属性时点击不可用
          scope.isShow = !scope.isShow;
          scope.$saferApply();
        });
      };

      var preLink = function preLink(scope, iElement) {
        var contentTmp = '';

        if (!source) return;
        // contentTmp = '<option fly-option value="" ng-repeat="item in ' + source + '" >{{item.faces}}</option>';
        // console.log(contentTmp);

        // console.log(angular.element('.select-options', iElement));


        // angular.element('.select-options', iElement).innerHtml = contentTmp;

        // for (i = 0, len = attrsTmp.length; i < len; i += 1) {
        //   angular.element('.select-options', iElement).append("");
        // }
      };

      // 对编译结果链接
      return {
        pre: preLink,
        post: postLink
      };
    };

    // 定义下拉框自身的控制器
    var controller = function($scope) {
      var i,
          len,
          attrsTmp = model.split('.');

      // 默认设置下拉选项框为隐藏的
      $scope.isShow = false;

      // 默认设置下拉框是否可用
      // TODO
      $scope.isDisabled = true;

      // 设置下拉框的值
      this.setValue = function(value) {
        var valTmp = $scope,
            lastAttr;

        // 由于ng-model的值可能为多级链接(taskForm.status.value)，这时需要想办法提出来
        for (i = 0, len = attrsTmp.length - 1; i < len; i += 1) {
          valTmp = valTmp[attrsTmp[i]];
        }

        lastAttr = attrsTmp[attrsTmp.length - 1];
        valTmp[lastAttr] = value;
        $scope.$saferApply();
      };

      // 设置下拉选项栏的可见状态
      this.showOptions = function(isShow) {
        $scope.isShow = isShow;
      };
    };

    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      scope: true,
      controller: controller,
      templateUrl: 'dest/template/form/select.html',
      compile: compile
    };
  }])
  /**
   * @description: 定义下拉选项
      点击选项时，包括设置下拉框的新值和隐藏下拉选项框
   *
   * @usage:
      <option fly-option value="2">XXX</option>
   *
   * @author: xbird
   */
  .directive('flyOption', [function() {

    var link = function(scope, element, attrs, ctrl) {
      element.on('click', function(e) {
        e.preventDefault();
        ctrl.showOptions(false); // 隐藏下拉选项
        ctrl.setValue(element.attr('value')); // 设置选项框的值
      });
    };

    return {
      restrict: 'AE',
      transclude: true,
      replace: true,
      require: '^?flySelect',
      template: '<li ng-transclude class="select-option"></li>',
      link: link
    };
  }]);