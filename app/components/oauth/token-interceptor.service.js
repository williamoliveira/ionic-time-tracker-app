module.exports.load = function (mod) {
    mod.factory('AuthTokenInterceptor', AuthTokenInterceptor);

    mod.config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthTokenInterceptor');
    });
};

/** @ngInject */
function AuthTokenInterceptor($q, API_CONSTANTS, AuthBearerTokenService) {
    'use strict';

    return {
        request: addAuthToken
    };

    function addAuthToken(config) {

        var token = AuthBearerTokenService.getToken();

        if (isApiCall(config) && token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config || $q.when(response);
    }

    
    function isApiCall(config){
        return config.url.indexOf(API_CONSTANTS.baseUrl) === 0;
    }
}