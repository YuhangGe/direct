'use strict'

var koa = require('koa');
var mysql = require('node-mysql');
var fs = require('fs');
var koa_router = require('koa-router');
var direct_prototype = [require('./lib/jing.controller.js')];
var config = require('./default_config.js')
var $ = require('./lib/global.js');

/*
 * import classes
 */
$.core.BaseController = require('./lib/classes/base_controller.js');
$.core.BaseModel = require('./lib/classes/base_model.js');
$.core.WebUser = require('./lib/classes/web_user.js');



function Jing_App() {
    $.log('new direct app instance');
    this.koa_app = koa();
    this.render = null;
    this.config = null;
    this.init();
    this.params = this.config.params;
    this.user = new $.core.WebUser();
}
Jing_App.__app_instance__ = null;

Jing_App.prototype = {
    init : function() {
        var config_file = global.PROTECTED_PATH + 'config/main.js';
        if(fs.existsSync(config_file)) {
            this.config = $.merge(config, require(config_file));
        } else {
            this.config = config;
        }
        this.config.render.force_compile = this.config.develop;

        if(this.config.render.name === 'silence') {
            this.render = require('./lib/render/silence.js')(this);
        } else {
//            this.render = require(this.render.path+this.render.name+'.js')(this);
            throw 'current version of direct does not support other render';
        }

        this._scan_controller_action();
        var app = this.koa_app;
        var me = this;
        app.use(koa_router(app));
        app.get('/', function *() {
            me._deal_controller_action(this.request, this.response);
        });
        app.all('/:controller', function *() {
            me._deal_controller_action(this.request, this.response, this.params.controller);
        });
        app.all('/:controller/:action', function *() {
            me._deal_controller_action(this.request, this.response, this.params.controller, this.params.action);
            $.log('after action')
        });
    },

    run : function() {
        /*
         * if not in develop mode, directly listen.
         */
        if(this.config.develop===false) {
            $.log('app is running, listening on port:' + this.config.port);
            this._do_run();
            return;
        }
        /*
         * if in develop mode, use nodemon to auto reload server.
         */
        $.log(process.argv);
        if(process.argv.length>2 && process.argv[2]==='nodemon') {
            $.log('now in nodemon mode, listening on port:' + this.config.port);
            this._do_run();
        } else {
            $.log('develop mode. load nodemon.');
            var nodemon = require('nodemon');
            nodemon({
                script : 'app.js',
                ext : 'js json html css less',
                execMap: {
                   'js': 'node --harmony'
                },
                args : ['nodemon'],
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
        this.koa_app.listen(this.config.port);
    }
};

for(var i=0;i<direct_prototype.length;i++) {
    $.extend(Jing_App.prototype, direct_prototype[i]);
}

function getDirectApp() {
    if(Jing_App.__app_instance__ === null) {
        Jing_App.__app_instance__ = new Jing_App();
    }
    return Jing_App.__app_instance__;
}

var jing = {
    app : getDirectApp(),
    Jing_App : Jing_App
};

module.exports = jing;
