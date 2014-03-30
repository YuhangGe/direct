var $ = require('../global.js');

function WebUser() {
    this.username = null;
    this.role = null;
    this.nick_name = null;
}
WebUser.prototype = {
    authenticate : function(user_model, username, password) {

    }
};

exports = module.exports = WebUser;
