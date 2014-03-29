var $ = require(FRAMEWORK_PATH + 'lib/util.js');
var Controller = require(FRAMEWORK_PATH + 'lib/classes/base_controller.js');


function UserController(app) {
    this.base(app);
}
UserController.prototype = {
    index_action : function() {
        this.render('index', {
            'name' : 'daisy',
            'age' : '23'
        })
    },
    login_action : function() {

    }
};

$.inherit(UserController, Controller);

exports = module.exports = UserController;
