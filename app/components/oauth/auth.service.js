module.exports.load = function (mod) {
    mod.factory('Auth', Auth);
};

/** @ngInject */
function Auth($http, $q, $rootScope, $log, API_CONSTANTS, AuthBearerTokenService, AuthRefreshTokenService) {
    "use strict";

    var currentUser = null;

    var endpoints = {
        me: API_CONSTANTS.baseUrl + "/profile/me",
        accessToken: API_CONSTANTS.baseUrl + API_CONSTANTS.auth.url
    };

    return {
        login: login,
        logout: logout,
        getCurrentUser: getCurrentUser,
        getCurrentUserAsync: getCurrentUserAsync,
        getCurrentUserFromServer: getCurrentUserFromServer,
        isAuthenticated: isAuthenticated,
        isAuthenticatedAsync: isAuthenticatedAsync,
        refreshToken: refreshToken
    };

    function isAuthenticated() {
        return !!currentUser;
    }

    function isAuthenticatedAsync() {

        return getCurrentUserAsync()
            .then(function () {
                return $q.resolve();
            })
            .catch(function () {
                return $q.reject();
            });

    }

    function getCurrentUser() {
        return currentUser;
    }

    function getCurrentUserAsync() {

        if (currentUser) {
            return $q.resolve(currentUser);
        }

        return getCurrentUserFromServer();
    }

    function getCurrentUserFromServer() {

        if (!AuthRefreshTokenService.hasToken()) {
            return $q.reject("No refresh token");
        }

        return $http.get(endpoints.me)
            .then(function (response) {

                if (!response.data.user) {
                    return $q.reject(response);
                }

                currentUser = response.data.user;

                $rootScope.$emit("userLoaded", currentUser);

                return $q.resolve(currentUser);
            });

    }

    function login(username, password) {

        var grant = {
            grant_type: "password",
            username: username,
            password: password,
            client_id: API_CONSTANTS.auth.clientId,
            client_secret: API_CONSTANTS.auth.clientSecret
        };

        var config = {
            ignoreAuthModule: true
        };

        return $http.post(endpoints.accessToken, grant, config)
            .then(function (response) {

                setTokensFromResponse(response.data);
                $rootScope.$emit("auth.authenticated");
                getCurrentUserAsync();

                return $q.resolve(currentUser);
            })
            .catch(function (response) {
                return $q.reject(response.data);
            });

    }

    function refreshToken() {

        if (!AuthRefreshTokenService.hasToken()) {
            return $q.reject("No refresh token");
        }

        var grant = {
            grant_type: "refresh_token",
            refresh_token: AuthRefreshTokenService.getToken(),
            client_id: API_CONSTANTS.auth.clientId,
            client_secret: API_CONSTANTS.auth.clientSecret
        };

        var config = {
            ignoreAuthModule: true
        };

        $log.debug('Refreshing token');

        return $http.post(endpoints.accessToken, grant, config)
            .then(function (response) {

                setTokensFromResponse(response.data);
                $rootScope.$emit("auth.authenticated");
                getCurrentUserAsync();

                return $q.resolve(currentUser);
            })
            .catch(function (response) {
                deleteTokens();
                return $q.reject(response);
            });

    }

    function logout() {
        currentUser = null;
        deleteTokens();
        $rootScope.$broadcast("auth.unauthenticated");

        return $q.resolve();
    }

    function deleteTokens() {
        AuthBearerTokenService.deleteToken();
        AuthRefreshTokenService.deleteToken();
    }

    function setTokensFromResponse(response) {

        AuthBearerTokenService.setToken(response.access_token);
        AuthBearerTokenService.setExpirationTime(response.expires_in);

        AuthRefreshTokenService.setToken(response.refresh_token);
    }

}