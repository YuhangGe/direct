'use strict'
/*
 * change path of framework and config if necessary
 * must be absolute path
 */
var global_path = {
    'framework': '/Users/abraham/workspace/jing/framework/',
    'protected' : '/Users/abraham/workspace/jing/protected/'
};

/*
 * global variable used in each file(such as controller, model etc.)
 */
global.FRAMEWORK_PATH = global_path.framework;
global.PROTECTED_PATH = global_path.protected;
/*
 * init web app
 */
var Jing_app = require(global_path.framework + "jing.js").app;
/*
 * run app
 */
Jing_app.run();
