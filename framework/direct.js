var koa = require('koa');
var mysql = require('node-mysql');
var $ = require('./lib/util.js');
var fs = require('fs');
var koa_router = require('koa-router');
var koa_parse = require('co-body');
var config = {
    'port' : 8888,
    'develop' : true,
    'db' : {
        /*
         * todo in future, may support other database
         */
        'type' : 'mysql',
        'host' : 'localhost',
        'user' : 'root',
        'password' : 'root',
        'scheme' : 'direct'
    },
    params : {
        /*
         * store user params
         */
    },
    render : {
        /*
         * todo in future, may support other render
         */
        'name' : 'silence',
        'force_compile' : true
    },
    deploy : {
        /*
         * todo in future, may support other server or remote deploy.
         * for example:
         * {
         *   'type' : 'copy',
         *   'path' : '/Users/abraham/nginx/www/'
         * }
         * or
         * {
         *   'type' : 'ftp',
         *   'host' : '192.168.2.103',
         *   'user' : 'xxx',
         *   'password' : 'xxxx'
         * }
         *
         * currently, 'local' deploy just simple parse, compress and copy file to 'assets' directory
         */
        'type' : 'local',
        'path' : 'assets/'
    }
};

exports = module.exports = direct;

function direct(config_file) {
    return new Direct_App(config_file);
}
direct.app = {
    'user' : null, //current session user
    'params' : null
};


function Direct_App(config_file) {
    $.log('new direct app instance');
    this.koa_app = koa();
    this.render = null;
    this.config = null;
    this.init(config_file);
    //runtime response and request;
    this.res = null;
    this.req = null;
    this.body = null;

    direct.app.params = config.params;
}
Direct_App.prototype = {
    init : function(config_file) {
        this.config = $.merge(config, require(config_file));
        this.config.render.force_compile = this.config.develop;

        $.log(this.config.port);

        if(this.config.render.name === 'silence') {
            this.render = require('./lib/render/silence.js')(this);
        } else {
//            this.render = require(this.render.path+this.render.name+'.js')(this);
            throw 'current version of direct does not support other render';
        }

        var app = this.koa_app;
        var me = this;
        app.use(koa_router(app));
        app.get('/', function *(next) {
//            var ctx = this;
//            $.log(ctx.params);
            me._deal_controller_action.call(me);
        });
        app.all('/:controller', function *() {
            me._deal_controller_action.call(me, this.params.controller);
        });
        app.all('/:controller/:action', function *() {
            me.res = this.response;
            me.req = this.request;
            me._deal_controller_action(this.params.controller, this.params.action);
            $.log('after action')
        });
    },
    _deal_controller_action : function (controller, action) {
        if(controller == null) {
            controller = 'site';
            action = 'index';
        }else if(action == null) {
            action = 'index';
        }

//        this.ctx.body += 'action';


//        controller = controller.toLowerCase();
//        action = action.toLowerCase();
        var c_file = PROTECTED_PATH + 'controllers/' + controller + '_controller.js';
        var a_name = action + '_action';
        var con, con_ins;
        $.log(c_file);
        if(!fs.existsSync(c_file)) {
            this._action_end('not found controller!');
            return;
        }
        try {
            con = require(c_file);
        } catch(ex) {
            this._action_end('not found controller!');
            return;
        }

        if(con == null) {
            this._action_end('not found controller!');
            return;
        }

        if(typeof con.prototype[a_name] !== 'function') {
            this._action_end('not found action!');
            return;
        }

        this.body = '';
        con_ins = new con(this);
        con_ins[a_name]();

        this._action_end(this.body);
        this.body = null;
        this.res = null;
        this.req = null;
    },
    _action_end : function(body) {
        this.res.body = body;
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

