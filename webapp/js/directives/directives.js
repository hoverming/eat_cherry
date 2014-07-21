/**
 * @description: Directives 集合器
 *               所有需要注入app的directive，都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 */

angular.module('greenbird.directives', [
  'fly.directives.example',
  'fly.directives.tabs',
  'fly.directives.greedy',
  'fly.directives.adaptation',
  'fly.directives.form',
  'gb.directives.copyright',
  'gb.directives.loginForm',
  'gb.directives.header',
  'gb.directives.sidebar',
  'gb.directives.dashboard',
  'gb.directives.mytasks',
  'gb.directives.order',
  'gb.directives.table'
]);
