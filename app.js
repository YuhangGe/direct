(function() {
    /*
     * change path of framework and config if necessary
     */
    var global_path = {
        framework : "./framework/",
        config : "./protected/config/"
    };
    /*
     * init web app
     */
    var direct = require(global_path.framework + "direct.js");
    var app = direct(global_path.config + "main.json");
    /*
     * run app
     */
    app.run();
})();
