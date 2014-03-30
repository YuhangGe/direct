'use strict'

var $ = require('../global.js');

exports = module.exports = BaseController;

function BaseController(app, request, response) {
    this.app = app;
    this.req = request;
    this.res = response;
    this._access_rule = null;
}
BaseController.prototype = {
    _parse_access_rule : function(acc_rule) {

    },
    access_rule : function() {
        return null;
    },
    access_check : function() {

    },
    access_control : function() {
        if(this._access_rule === null) {
            let ar = this.access_rule();
            if(ar===null) {
                return;
            }
            this._access_rule = this._parse_access_rule(ar);
        }
        //todo access check
        if(this.access_check()) {

        } else {

        }
    },
    _before_action : function() {
        this.access_control();
    },
    render : function(action_file, data) {
        this.res.body = 'hello boy!now goto sleep!';
    },
    _after_action : function() {
        //do nothing. you need override this function.
    }
};

