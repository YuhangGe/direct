var $ = require(FRAMEWORK_PATH + 'lib/global.js');

function UserController(app, request, response) {
    this.base(app, request, response);
}
UserController.prototype = {
    access_rule : function() {
        return {
            'deny' : '*', // * ? !admin
            'allow' : '*'
        };
    },
    /*
     * override
     */
    access_check : function() {
        var passed = this.callBase('access_check');
        if(passed === false) {
            return false;
        }
        /*
         * do more complex check
         * todo ip check
         */


        return true;
    },
    index_action : function() {
        this.render('index', {
            'name' : 'daisy',
            'age' : '23'
        })
    },
    login_action : function() {
        this.res.body = {
            'love' : '小静'
        };
    }
};

$.inherit(UserController, $.core.BaseController);

exports = module.exports = UserController;
