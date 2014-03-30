var default_config = {
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
        'name' : 'silence'
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
         * currently, 'local' deploy just simply pre-process, compress and copy file to 'assets' directory
         */
        'type' : 'local',
        'path' : 'assets/',
        /*
         * js compiler.
         * compile other script such as coffee/dart to js.
         */
        'js_compiler' : {
            'coffee' : '.coffee',
            'dart' : '.dart'
        },
        /*
         * css preprocessor.
         * if filename extension of files under `/protected/resources/css` is .scss we use sass
         * if .less then less, .styl then stylus.
         * you can change the default extension by configure bellow.
         */
        'css_preprocessor' : {
            'sass' : '.scss',
            'less' : '.less',
            'stylus' : '.styl'
        },
        /*
         * compressor choose to use.
         * we use 'node-minify' module to do compressing. see more: https://github.com/srod/node-minify.
         */
        'compressor' : {
            'css' : 'clean-css', //yui-css, clean-css, csso
            'js' : 'uglifyjs' //uglifyjs, gcc(google closure compiler), yui-js
        }
    }
};
exports = module.exports = default_config;