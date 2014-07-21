/**
 * @component: directive
 * @name：gb.directives.loginForm
 * @stability:
 * @description: 用户登录控件
 * @author： hcz
 */

var USERNAME_REGEXP = /[a-zA-Z][a-zA-Z0-9]{3,}/;
var PASSWORD_REGEXP = /[a-zA-Z0-9]{6,}/;
angular.module('gb.directives.loginForm', [])
  .directive('userDoLogin', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {

        angular.element(element).on('click', function (e) {
          e.preventDefault();

          var form = angular.element('form'),
              warning = angular.element('#warningText');

          // 判断输入是否为空
          if (!scope.user || !scope.user.userName) {
            warning.text('账号或密码不能为空');
            return;
          }


          var isUserName = USERNAME_REGEXP.test(scope.user.userName),
              ispwd = PASSWORD_REGEXP.test(scope.user.password);

          if ( !isUserName && ispwd) {
            warning.text('账号格式不正确');
            form.find('.username').addClass('inputError');
            return; 
          } 
          if ( !ispwd && isUserName) {
            warning.text('密码格式不正确');
            form.find('.password').addClass('inputError');
            return;
          }
          if (!isUserName && !ispwd) {
            warning.text('账号和密码格式不正确，请重新输入');
            form.find('.username').addClass('inputError');
            form.find('.password').addClass('inputError');
          }
          scope.$emit('doLogin', scope.user);
        });
      }
    };
  })
  .directive('inputClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {
        angular.element(element).on('click', function (e) {
          e.preventDefault();
          angular.element('.errorText').hide();    //去掉账号为空的提示
          var userName = angular.element('.username'),
              userPassword = angular.element('.password');

          // 改变输入错误时的输入框样式
          angular.element('#warningText').text('');
          if (userName.hasClass('inputError') && userName.is(':focus')) {
            userName.removeClass('inputError');
          }
          if (userPassword.hasClass('inputError') && userPassword.is(':focus')) {
            userPassword.removeClass('inputError');
          }
        });
      }
    };
  });

