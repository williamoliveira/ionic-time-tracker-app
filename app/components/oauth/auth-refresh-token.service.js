module.exports.load = function (mod) {
    mod.factory("AuthRefreshTokenService", AuthRefreshTokenService);
};

/** @ngInject */
function AuthRefreshTokenService($localStorage) {

    return {
        getToken: getToken,
        setToken: setToken,
        deleteToken: deleteToken,
        hasToken: hasToken
    };

    function hasToken(){
        return !!getToken();
    }

    function getToken() {
        return $localStorage.refreshToken;
    }

    function setToken(token) {
        if (token) {
            $localStorage.refreshToken = token;
        } else {
            deleteToken();
        }
    }

    function deleteToken(){
        delete $localStorage.refreshToken;
    }

}