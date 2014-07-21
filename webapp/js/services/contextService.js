/**
 * @component:
 * @name: gb.services.contextService
 * @Stability:
 * @description:
 * @author: xbird
 */

var app = angular.module('gb.services.contextService', []);

  /**
   * 保存上下文
   */
  app.factory('contextService', ['Context', function(Context) {
    'use strict';

    var _context_ = [],
        _current_ = null,
        contextService = {};

    contextService.push = function push(context) {
      _context_.push(context);
    };

    contextService.pop = function pop() {
      _current_ = _context_.pop();
      return _current_;
    };

    contextService.list = function list() {
      return _context_;
    };

    contextService.create = function create() {
      var tmpContext = new Context();

      // tmpContext.allTasksPage = [];

      if (_current_ && _current_ instanceof Context) {
        _context_.push(_current_);
      }
      _current_ = tmpContext;
    };

    contextService.current = function() {
      return _current_;
    };

    contextService.get = function(key) {
      return _current_.get(key);
    };

    contextService.set = function(key, value) {
      return _current_.set(key, value);
    };

    return contextService;
  }]);

  /**
   * 上下文对象
   */
  app.factory('Context', [function() {
    var Context = function() {};

    Context.prototype.get = function(key) {
      return this[key] || null;
    };

    Context.prototype.set = function(key, value) {
      if (arguments.length < 2) return;
      this[key] = value;
    };

    return Context;
  }]);