module.exports.load = function (mod) {
  mod.factory("AuthBearerTokenService", AuthBearerTokenService);  
};

/** @ngInject */
function AuthBearerTokenService() {
    "use strict";

    var token = null;
    var expirationTime = null;
    
    return {
        getToken: getToken,
        setToken: setToken,
        deleteToken: deleteToken,
        hasToken: hasToken,
        setExpirationTime: setExpirationTime,
        isExpired: isExpired
    };

    function hasToken(){
        return !!getToken();
    }

    function getToken() {
        return token;
    }

    function setToken(tkn) {
        if (tkn) {
            token = tkn;
        } else {
           deleteToken();
        }
    }

    function deleteToken(){
        token = null;
    }
    
    function setExpirationTime(seconds) {
        var now = new Date();
        //*10 because js dates works in milliseconds
        expirationTime = new Date(now.getTime() + seconds*10);
    }

    function isExpired() {
        var now = new Date();
        return expirationTime.getTime() <= now.getTime();
    }
}
