/**
 * @component: Constructor
 * @name: gb.constructor
 * @Stability:
 * @description: Constructor collection
 * @author: xbird
 */

angular.module('greenbird.constructor', [])

  .factory('TaskForm', [function () {
    'use strict';

    // task 表单的状态记录，包括数据和行为
    // 每一个表单控件包括value(值)、disabled(true:disabled, false:normal)和invisible
    var TaskForm = function TaskForm() {

      this.reset(arguments[0]);
    };

    TaskForm.prototype.reset = function() {

      var opt = arguments[0] || {};

      // Set value
      this.taskCode       = opt.taskCode        || { value: '',  disabled: false, invisible: false };   // 工单号
      this.name           = opt.name            || { value: '',  disabled: false, invisible: false };   // 昵称
      this.phone          = opt.phone           || { value: '',  disabled: false, invisible: false };   // 电话
      this.email          = opt.email           || { value: '',  disabled: false, invisible: false };   // 邮箱
      this.businessCode   = opt.businessCode    || { value: '',  disabled: false, invisible: false };   // 单号
      this.status         = opt.status          || { value: 1, disabled: false, invisible: false };   // 完成状态，默认值已完成
      this.involve        = opt.involve         || { value: 1, disabled: false, invisible: true };    // 介入
      this.type           = opt.type            || { value: 1, disabled: false, invisible: false };   // 工单类型，默认值为1
      this.emergent       = opt.emergent        || { value: 1, disabled: false, invisible: false };   // 紧急状态，默认值一般
      this.remarkLabel    = opt.remarkLabel     || { value: '',  disabled: false, invisible: false };   //
      this.content        = opt.content         || { value: '',  disabled: false, invisible: false };   // 备注说明
      this.alertTime      = opt.alertTime       || { value: '0000-00-00 00:00:00',  disabled: true, invisible: false };   // 提醒时间
      this.assignedGroup  = opt.assignedGroup   || { value: '', disabled: false, invisible: true };  // 指派组
      this.assignedOwner  = opt.assignedOwner   || { value: '', disabled: false, invisible: true };  // 指派成员
      this.submit         = opt.submit          || { action: 'create', disabled: true, invisible: true }; //
    };

    /**
     * @Description: Set value
     * @Usage:
        instance.set(name, value);                              Set one value
        instance.set({ name: { value: ''[, status: ''...] } }); Set a set of value and property
     *
     * @Return: this
     */
    TaskForm.prototype.set = function() {
      var fParam = arguments[0],
          sParam = arguments[1],
          that = this;

      if (!fParam) { return this; }

      // 区分参数类型
      if (typeof fParam === 'object') {
        angular.forEach(fParam, function(value, key) {
          that[key] = value;
        });
      } else {
        // console.log(this[fParam].value);
        this[fParam].value = sParam || '';
      }
      return this;
    };

    /**
     * @Description: Get value
     * @Usage:
        instance.get();                 Get all value
        instance.get(name);             Get one value
        instance.get(name, [name...]);  Get a set of value
     *
     * @Return: Plain object
     */
    TaskForm.prototype.get = function() {

      var fParam = arguments[0],
          result = {},
          len,
          i;

      // 根据参数类型，获取相应的值
      if (!fParam) {
        for(i in this) {
          if (this.hasOwnProperty(i)) {
            result[i] = this[i].value;
          }
        }
      } else {
        for (i = 0, len = arguments.length; i < len; i += 1 ) {
          var nameTmp = arguments[i];
          result[nameTmp] = this[nameTmp].value;
        }
      }
      return result;
    };

    return TaskForm;

  }]);