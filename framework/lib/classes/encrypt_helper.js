var crypto = require("crypto");

function encode(str) {
    if(str == null || str.length === 0) {
        console.log("password encode should not be empty!");
        /*
         * programmer should ensure the password's length
         * if password is empty we just simply set it be 'love'
         */
        str = 'love';
    }
    var i1 = str[0];
    var i2 = str[str.length-1];
    if(!/[0-9a-zA-Z\\.\\/]/.test(i1)) {
        //ge
        i1 = "g";
    }
    if(!/[0-9a-zA-Z\\.\\/]/.test(i2)) {
        //wang
        i2 = "w";
    }
    var key = i1+"love"+i2;
    /*
     * we use pbkdf2 to hash password.
     * the 'salt key' rely on password itself, will this method be more safe? I don't know, just guess.
     */
    try{
        return crypto.pbkdf2Sync(str, key , 1000, key.length).toString("hex");
    }catch(ex) {
        return null;
    }
}

exports.encode = module.exports.encode = encode;