exports = module.exports = silence;

function silence(app) {
    /*
     * singleton pattern
     */
    if(silence.__instance__ === null) {
        silence.__instance__ = new SilenceRender(app);
    }
    return silence.__instance__;
}
silence.__instance__ = null;

function SilenceRender(app) {
    this.app = app;
}
SilenceRender.prototype = {

};

