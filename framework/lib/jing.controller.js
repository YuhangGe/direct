'use strict'
var $ = require('./global.js');
var fs = require('fs');


var controller_action_map = new Map();

var controller_prototype = {
    _scan_controller_action : function() {
        $.log('scan controller folder.');
        let c_path = global.PROTECTED_PATH + 'controllers/';
        let f_list = fs.readdirSync(c_path);
        for(let i=0;i<f_list.length;i++) {
            let f = f_list[i], _m = f.match(/^(\w+)_controller\.js$/);
            if(_m === null) {
                continue;
            }
            let con = require(c_path + f);
            if(typeof con !=='function') {
                //in future, if nodejs/v8 supports 'class', this check may be typeof con !== 'class'
                continue;
            }
            let action_map = new Map();
            for(let act in con.prototype) {
                let am = act.match(/^(\w+)_action$/);
                let func = con.prototype[act];
                if(am !== null && typeof func === 'function') {
                    action_map.set(am[1], true);
                }
            }

            controller_action_map.set(_m[1], {
                construct : con,
                action_map : action_map
            });
        }
//        $.log(controller_action_map.get('user').action_map.get('index'));
    },
    _deal_controller_action : function (request, response, controller, action) {
        if(controller == null) {
            controller = 'site';
            action = 'index';
        }else if(action == null) {
            action = 'index';
        }
        if(controller_action_map.has(controller)===false) {
            this._action_end(response, "no controller found!");
            return;
        }
        let con_obj = controller_action_map.get(controller);
        if(con_obj.action_map.has(action)===false) {
            this._action_end(response, "no action found!");
            return;
        }
        let con = con_obj.construct;
        let con_ins = new con(this, request, response);
        con_ins._before_action();
        con_ins[action+'_action']();
        con_ins._after_action();
    },
    _action_end : function(res, body) {
        res.body = body;
    }
};

exports = module.exports = controller_prototype;