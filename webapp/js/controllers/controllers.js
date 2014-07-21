/**
 * @description: Controllers 集合器
 *               所有需要注入app的controller，都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 */

angular.module('greenbird.controllers', [
  'loading',
  'logout',
  'login',
  'main',
  'main.header',
  'main.dashboard',
  'main.mytasks',
  'main.order',
  'main.other'
]);
