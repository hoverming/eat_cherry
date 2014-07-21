/**
 * @description: Filters 集合器
 *               所有需要注入app的filter都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('greenbird.filters', [
  'gb.task.filters',
  'gb.order.filters'
]);
