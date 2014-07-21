/**
 * @component: controller
 * @name: main.order
 * @description:
 * @author: Patrick
 * @creat on: 2014/6/29.
 */

angular.module('main.order', [])
    .controller('orderCtrl', [
        '$scope',
        '$filter',
        'ngTableParams',
        'OrderResource',
        'orderConstants',
        '$gbSetting',
        'hotkeys',
        function ($scope, $filter, TableParams, OrderResource, orderConstants, $gbSetting, hotkeys) {
            'use strict';
            //-- 激活菜单栏
            $scope.$emit('activeMenu', 'orders');

            //-- 定义模板
            $scope.templates = {
                //订单列表-
                "list" : '/partials/order/list.html',
                //订单查询
                "query" : '/partials/order/query.html',
                //订单明细
                "detail" : '/partials/order/detail.html',
                //订单明细--基本信息
                "detailBasicInfo" : '/partials/order/detail/basicInfo.html',
                //订单明细--详细信息
                "detailFullInfo" : '/partials/order/detail/fullInfo.html',
                //订单明细--支付信息
                "detailPayInfo" : '/partials/order/detail/payInfo.html',
                //订单明细--配送信息
                "detailShipmentInfo" : '/partials/order/detail/shipmentInfo.html',
                //订单明细--商品评论
                "detailComments" : '/partials/order/detail/comments.html'
            };

            //-- 查询条件常量
            $scope.orderConstants = orderConstants;

            //-- 查询条件模型
            $scope.searchCriteria = {
                //订单编号,多个用逗号分隔
                "number" : "",
                //SKU编号
                "skuNumber" : "",
                //SKU名称
                "skuName" : "",
                //收货人姓名
                "receiverName" : "",
                //收货人电话
                "receiverTel" : "",
                //客户账户名
                "acountName" : "",
                //订单查询状态
                "orderStatus" : "",
                //销售渠道
                "channelId" : "",
                //监控状态
                "healthMonitor" : "",
                //支付状态
                "paymentStatus" : "",
                //创建时间开始
                "createTimeBegin" : "",
                //创建时间结束
                "createTimeEnd" : "",
                //厂家sfaId
                "sfaId" : ""
            };
            //用于记录下用户点击查询按钮时候的查询条件
            $scope.searchCriteriaSaved = angular.copy($scope.searchCriteria);

            //触发查询
            $scope.triggerSearch = function(){
                //用于记录下此时间点的查询条件
                $scope.searchCriteriaSaved = angular.copy($scope.searchCriteria);
            };

            //重置查询条件
            $scope.resetSearch = function(){
                //用于记录下此时间点的查询条件
                for(var key in $scope.searchCriteria){
                    $scope.searchCriteria[key] = "";
                }
            };

            //详细页是否最大化窗口
            $scope.isDetailPanelMax = false;

            //切换详细页最大化最大化窗口
            $scope.toggleDetailPanelMax = function(){
                $scope.isDetailPanelMax = ! $scope.isDetailPanelMax;
            };


            //查询订单函数
            $scope.orderTableParams = new TableParams({
                page: 1,
                count: 20
            }, {
                counts: [ 20, 50, 100],
                total: 0,
                getData: function ($defer, params) {
                    //获得订单列表
                    //暂时不做服务器多页排序
                   /* if(params.sorting()){
                        var orderBy = "";
                        var orderByArray = params.orderBy();
                        for(var index in orderByArray){
                            var item = orderByArray[index];
                            orderBy += item.substr(1,item.length) + " " + (item[0] == "+"?"asc": "desc");
                        }
                        $scope.searchCriteria.orderBy = orderBy;
                    }*/
                    //=========构造查询条件 start =========
                    var postData = angular.copy($scope.searchCriteriaSaved);
                    //页码
                    postData.pageIndex = params.page();
                    //每页多少条
                    postData.pageSize = params.count();
                    if(postData.createTimeBegin){
                        postData.createTimeBegin = moment(postData.createTimeBegin).format('YYYY-MM-DD') + " 00:00:00";
                    }
                    if(postData.createTimeEnd){
                        postData.createTimeEnd = moment(postData.createTimeEnd).format('YYYY-MM-DD') + " 23:59:59";
                    }
                    //=========构造查询条件 end =========

                    OrderResource.query(postData).$promise.then(function (resp) {
                        params.total(resp.query.totalRecord);

                        $scope.orderList = resp.models;
                        var orderedData = (params.sorting() && (params.orderBy().length > 0)) ? $filter('orderBy')($scope.orderList, params.orderBy()) : $scope.orderList;

                        if($gbSetting.isMockEnv) {

                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }else{
                            $defer.resolve(orderedData);
                        }
                    });


                }
            });


            //获得订单信息函数
            $scope.showDetail = function (orderId) {

                $scope.isDetailPanelMax = true;
                $scope.currOrder = null;
                $scope.currencySymbol = null;
                $scope.shipments = null;
                $scope.payments = null;
                $scope.comments = null;

                //获得订单主要信息
                OrderResource.get({id: orderId}).$promise.then(function (resp) {
                    $scope.currOrder = resp.model;

                    $scope.currencySymbol = orderConstants.currencies[$scope.currOrder.currencyId];
                });

                //获得订单发货信息
                OrderResource.getShipment({id: orderId}).$promise.then(function (resp) {
                    $scope.shipments = resp.models;

                });
                //获得订单支付信息
                OrderResource.getPayment({id: orderId}).$promise.then(function (resp) {
                    $scope.payments = resp.models;

                });
                //获得订单评论信息
                OrderResource.getComment({id: orderId}).$promise.then(function (resp) {
                    $scope.comments = resp.models;
                });
            };

            // -- 快捷键
            hotkeys.add({
                combo: 'esc',
                description: '关闭详细页',
                callback: function() {
                    $scope.isDetailPanelMax = false;
                }
            });

            $scope.$on('fetchRefresh', function() {
                $scope.orderTableParams.reload();
            });

            /**
             * 将日期对象转换为 yyyy-MM-dd 格式字符串
             * @param date
             */
            function getDateString(date){
                var str = "";
                str += date.getFullYear() +"-";
                str += (date.getMonth()+1) +"-";
                str += date.getDay() +" ";
                str += date.getHours() +" ";

            }




        }

    ]);
