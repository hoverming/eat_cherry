/**
 * @component: directive
 * @name: fly.directives.greedy
 * @stability:
 * @description: 将DOM布局想象成一个个的盒子，
 *  greedy指令，用于贪婪的拉伸垂直高度，直至在整个垂直方向将整个父容器挤满
 * @author: xbird
 */

angular.module('fly.directives.greedy', [])
    .directive('greedy', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var parentElement = element.parent(),
                    totalHeight = 0;
                angular.forEach(angular.element(parentElement).children(), function (node, key) {
                    totalHeight += angular.element(node).outerHeight();
                });
                totalHeight -= angular.element(element).outerHeight();
                element.css('height', parentElement.innerHeight() - totalHeight);
            }
        };
    })
/**
 * Usage:贪婪设置div 高度，
 * param: width 是已知的已占高度
 */
    .directive('greedyEat', [function (width) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if(angular.isDefined(attrs.greedyEat) && attrs.greedyEat !==""){
                    element.css('height', document.body.clientHeight - attrs.greedyEat);
                }else{
                    //do nothing
                }
            }
        };
    }])

;


