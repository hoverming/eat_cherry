/**
 * @component: service
 * @name: gb.services.orderService
 * @description:
 * @author: Patrick
 * @creat on: 2014/6/29.
 */
angular.module('gb.services.orderService',[])
    .factory('OrderResource', ['$resource','$gbSetting',
        function($resource, $gbSetting){

        var orderResource;
        if($gbSetting.isMockEnv){
            orderResource =  $resource('/mock/order/orders.json',{id:'@id'},
                {
                    'query':  {method:'GET', isArray:false},
                    'get':  {url :'/mock/order/:id/main.json' },
                    'getShipment':  {url :'/mock/order/:id/shipments.json' },
                    'getPayment':  {url :'/mock/order/:id/payment.json' },
                    'getComment':  {url :'/mock/order/:id/comment.json' }
                }
            );
        }else{
            orderResource =  $resource('/salesOrder/search',{id:'@id'},
                {
                    'query':  {method:'POST', isArray:false},
                    'get':  {url :'/salesOrder/:id' },
                    'getShipment':  {url :'/salesOrder/:id/shipment' },
                    'getPayment':  {url :'/salesOrder/:id/payment' },
                    'getComment':  {url :'/salesOrder/:id/comment' }
                }
            );
        }
        return orderResource;
    }]);
