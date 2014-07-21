/**
 * @description: Services 集合器
    所有需要注入app的service都要在这里注册
 *
 * @author: xbird(xbird.xiao@corp.globalmarket.com)
 **/

angular.module('greenbird.services', [
  'gb.services.smsService',
  'gb.services.rolesService',
  'gb.services.userService',
  'gb.services.taskService',
  'gb.services.configService',
  'gb.services.contextService',
  'gb.services.orderService'
])

  /**
   * @description: app配置器
   */
  .factory('appConfigurator', [function() {

    // 状态namaspace，状态是搜索时的凭证，状态需要手动添加
    var _status = {
      '_acitvedMenuID': '',
      '_userid': '',
      '_username': '',
      '_searchInput': ''
    };

    return {
      /**
       * @description: 设置状态，不可设置不存在的状态
       *
       * @param: status <string> 状态名
       *         val    <all>    状态值
       * @return: this <object>  对象自身 可进行链式操作
       */
      setStatus: function(status, val) {
        if (_status[status] === undefined) {
          return false;
        }
        _status[status] = val || '';
        return this;
      },
      /**
       * @description: 获取状态
       *
       * @param: status <string> 状态名
       * @retuen:       <all || undefined> 状态值
       */
      getStatus: function(status) {
        return _status[status];
      }
    };
  }]);