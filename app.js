/*
 * change path of framework and config if necessary
 * must be absolute path
 */
var global_path = {
    'framework': '/Users/abraham/workspace/direct/framework/',
    'protected' : '/Users/abraham/workspace/direct/protected/',
    'config' : '/Users/abraham/workspace/direct/protected/config/'
};

/*
 * global variable used in each file(such as controller, model etc.)
 */
global.FRAMEWORK_PATH = global_path.framework;
global.PROTECTED_PATH = global_path.protected;
/*
 * init web app
 */
var direct = require(global_path.framework + "direct.js");
var app = direct(global_path.config + "main.js");
/*
 * run app
 */
app.run();
