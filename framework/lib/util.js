var encrypt_helper =  require('./classes/encrypt_helper.js');
var om = require('object-merge');
var fs = require('fs');

var $ = {
    log : function(msg) {
        console.log(msg);
    },
    extend : function(obj) {

    },
    merge : function(obj1, obj2) {
        return om(obj1, obj2);
    },
    encrypt : function(password) {
        return encrypt_helper.encode(password);
    },
     
    delegate : function(instance, func) {
        return function() {
            func.apply(instance, arguments);
        }
    },
    /**
     * js 面向对象。
     *
     */
    inherit : function(inheritClass, baseClass) {
        if(typeof inheritClass === 'undefined' || typeof baseClass ==='undefined'){
            console.trace();
            throw 'inherit error!';
        }
        //首先把父类的prototype中的函数继承到子类中
        for(var pFunc in baseClass.prototype) {
            var sp = inheritClass.prototype[pFunc];
            //如果子类中没有这个函数，添加
            if( typeof sp === 'undefined') {
                inheritClass.prototype[pFunc] = baseClass.prototype[pFunc];
            }
            //如果子类已经有这个函数，则忽略。以后可使用下面的callBase函数调用父类的方法

        }
        //保存继承树，当有多级继承时要借住继承树对父类进行访问
        inheritClass.__base_objects__ = new Array();
        inheritClass.__base_objects__.push(baseClass);

        if( typeof baseClass.__base_objects__ !== 'undefined') {
            for(var i = 0; i < baseClass.__base_objects__.length; i++)
                inheritClass.__base_objects__.push(baseClass.__base_objects__[i]);
        }

        /**
         * 执行父类构造函数，相当于java中的this.super()
         * 不使用super是因为super是ECMAScript保留关键字.
         * @param {arguments} args 参数，可以不提供
         */
        inheritClass.prototype.base = function(args) {

            var baseClass = null, rtn = undefined;
            if( typeof this.__inherit_base_deep__ === 'undefined') {
                this.__inherit_base_deep__ = 0;
            } else {
                this.__inherit_base_deep__++;
                //$.dprint('d+:'+this.__inherit_deep__);
            }

            baseClass = inheritClass.__base_objects__[this.__inherit_base_deep__];

            if( typeof args === 'undefined' || args == null) {
                rtn = baseClass.call(this);
            } else if( args instanceof Array === true) {
                rtn = baseClass.apply(this, args);
            } else {
//					var _args = new Array();
//					for(var i = 0; i < arguments.length; i++)
//						_args.push(arguments[i]);
//					rtn = baseClass.apply(this, _args);
                // arguments 是Object而不是Array，需要转换。
                rtn = baseClass.apply(this, [].slice.call(arguments));
            }

            this.__inherit_base_deep__--;

            //$.dprint('d-:'+this.__inherit_deep__);
            return rtn;
        }
        /**
         * 给继承的子类添加调用父函数的方法
         * @param {string} method 父类的函数的名称
         * @param {arguments} args 参数，可以不提供
         */
        inheritClass.prototype.callBase = function(method, args) {

            var baseClass = null, rtn = undefined;

            if( typeof this.__inherit_deep__ === 'undefined') {
                this.__inherit_deep__ = 0;

            } else {
                this.__inherit_deep__++;
                //$.dprint('d+:'+this.__inherit_deep__);
            }

            //$.dprint(this.__inherit_deep__);
            baseClass = inheritClass.__base_objects__[this.__inherit_deep__];

            var med = baseClass.prototype[method];
            if( typeof med === 'function') {
                if( typeof args === 'undefined' || args === null) {
                    rtn = med.call(this);
                } else if( args instanceof Array === true) {
                    rtn = med.apply(this, args);
                } else {
//						var _args = new Array();
//						从位置1开始，因为第0位参数是method的名称
//						for(var i = 1; i < arguments.length; i++) {
//							_args.push(arguments[i]);
//						}
                    rtn = med.apply(this, [].slice.call(arguments, 1));
                }
            } else {
                throw 'There is no method:' + method + ' in baseClass';
            }

            this.__inherit_deep__--;

            //$.dprint('d-:'+this.__inherit_deep__);
            //$.dprint('----');
            return rtn;
        }
    }
};

exports = module.exports = $;