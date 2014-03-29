var $ = require(FRAMEWORK_PATH + 'lib/util.js');
var Controller = require(FRAMEWORK_PATH + 'lib/classes/base_controller.js');


function SiteController(app) {
    this.base(app);
}
SiteController.prototype = {
    index_action : function() {
        this.render('index', {
            'name' : 'daisy',
            'age' : '23'
        })
    },
    login_action : function() {

    }
};

$.inherit(SiteController, Controller);

exports = module.exports = SiteController;


