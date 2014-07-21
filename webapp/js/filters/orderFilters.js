/**
 * @description: Order filters
 *
 * @author: Patrick.he
 **/

angular.module('gb.order.filters', [])
    //-- 订单状态
    .filter('orderStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.statuses[value];
        };
    }])
    //-- 销售渠道
    .filter('orderChannel', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.channels[value];
        };
    }])
    //-- 监控状态
    .filter('orderHealthStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.healthStatuses[value];
        };
    }])
    //-- 货币
    .filter('orderCurrency', ['orderConstants', '$filter', '$sce', function (orderConstants, $filter, $sce) {
        return function (amount, currencyId) {
              var symbol = orderConstants.currencyIcons[currencyId];
              if(angular.isUndefined(symbol) || null === amount || "" === amount){
                  return "";
              }else{
                  if(symbol.indexOf("fa-")>=0){
                      return $sce.trustAsHtml('<i class="fa '+ symbol+'"></i> ' + $filter('currency')(amount, "") );
                  }else{
                      return $filter('currency')(amount, symbol  + " ") ;
                  }

              }
        };
    }])
    //-- 发货类型
    .filter('orderShippingType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingTypes[value];
        };
    }])
    //-- 订单类型
    .filter('orderType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.orderTypes[value];
        };
    }])
    //-- 支付状态
    .filter('orderPaymentStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.paymentStatuses[value];
        };
    }])
    //-- 支付事务类型
    .filter('orderPaymentTransactionType', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.paymentTransactionTypes[value];
        };
    }])
    //-- 运输类型
    .filter('orderShippingMethod', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingMethods[value];
        };
    }])
    //-- 运输状态
    .filter('orderShippingStatus', ['orderConstants', function (orderConstants) {
        return function (value) {
            return orderConstants.shippingStatuses[value];
        };
    }])

;

