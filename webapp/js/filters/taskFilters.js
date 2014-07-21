/**
 * @description: Task filters
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('gb.task.filters', [])

  // 状态（完成，未完成）
  .filter('taskStatus', [function() {
    return function(value) {
      var mapping = {
        '1': '已完成',
        '2': '未完成'
      };
      return mapping[value];
    };
  }])

  // 程度（一般，紧急）
  .filter('taskEmergent', [function() {
    return function(value) {
      var mapping = {
        '1': '一般',
        '2': '紧急'
      };
      return mapping[value];
    };
  }])

  // 类型（产品咨询，订单受理，退换货）
  .filter('taskType', [function() {
    return function(value) {
      var mapping = {
        '1': '活动及政策',
        '2': '商城展示',
        '3': '订单需求',
        '4': '配送问题',
        '5': '漏发',
        '6': '退换货',
        '7': '发票',
        '8': '退款',
        '9': '其他'
      };
      return mapping[value];
    };
  }])

  // 介入
  .filter('remarkCreateMethod', [function() {
    return function(value) {
      var mapping = {
        '0': '跟进',
        '1': '介入',
        '2': '提醒'
      };
      return mapping[value];
    };
  }])

  // 指派组别
  .filter('assignedGroup', [function() {
    return function(value) {
      var mapping = {
        '0': '自己',
        '1': '退换货组',
        '2': '产品咨询组',
        '3': '物流跟踪组'
      };
      return mapping[value];
    };
  }])

  // 介入
  .filter('involve', [function() {
    return function(value) {
      var mapping = {
        '1': '介入'
      };
      return mapping[value];
    };
  }]);
