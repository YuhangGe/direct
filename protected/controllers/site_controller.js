var $ = require(FRAMEWORK_PATH + 'lib/global.js');

function SiteController(app, request, response) {
    this.base(app,request, response);
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

$.inherit(SiteController, $.core.BaseController);

exports = module.exports = SiteController;


