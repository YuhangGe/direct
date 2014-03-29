var koa = require("koa");
var mysql = require("node-mysql");
var $ = require("./lib/util.js");

var config = {
    'port' : 8888,
    'develop' : true,
    'db' : {
        'host' : 'localhost',
        'user' : 'root',
        'password' : 'root',
        'scheme' : 'direct'
    }
};

exports = module.exports = direct;

function direct(config_file) {
    return new Direct_App(config_file);
}

function Direct_App(config_file) {
    $.log('new direct app instance');
    this.koa_app = koa();
    this.init();
}
Direct_App.prototype = {
    init : function() {
        this.koa_app.use(function *() {
           $.log("user visit.");
           this.body = "hello world!";
        });
    },
    run : function() {
        /*
         * if not in develop mode, directly listen.
         */
        if(config.develop===false) {
            $.log("app is running, listening on port:" + config.port);
            this._do_run();
            return;
        }
        /*
         * if in develop mode, use nodemon to auto reload server.
         */
        $.log(process.argv);
        if(process.argv.length>2 && process.argv[2]==="nodemon") {
            $.log("now in nodemon mode, listening on port:" + config.port);
            this._do_run();
        } else {
            $.log("develop mode. load nodemon.");
            var nodemon = require("nodemon");
            nodemon({
                script : "app.js",
                ext : "js json html css less",
                execMap: {
                   "js": "node --harmony"
                },
                args : ["nodemon"],
                watch : [
                    'protected/',
                    'app.js'
                ]
            });
            nodemon.on('start', function () {
                console.log('nodemon has started');
            }).on('quit', function () {
                console.log('nodemon has quit');
            }).on('restart', function (files) {
                console.log('nodemon restarted due to: ', files);
            });
        }
    },
    _do_run : function() {

        this.koa_app.listen(config.port);
    }
};

