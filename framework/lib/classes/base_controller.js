var $ = require('../util.js');

exports = module.exports = BaseController;

function BaseController(app) {
    this.app = app;
}
BaseController.prototype = {
    render : function(action_file, data) {
        $.log(action_file);
        $.log(data);
        this.app.body += 'hello boy!now goto sleep!';
    }
};

