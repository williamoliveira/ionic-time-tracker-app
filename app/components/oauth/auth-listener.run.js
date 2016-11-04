module.exports.load = function (mod) {
    mod.run(AuthListener);
};

function AuthListener($rootScope, authService, Auth, AuthTokenInterceptor) {
    'use strict';

    $rootScope.$on('event:auth-loginRequired', function () {
        Auth.refreshToken()
            .then(loginSuccess)
            .catch(unauthenticated);
    });

    function loginSuccess(){
        authService.loginConfirmed('success', function (config) {
            return AuthTokenInterceptor.request(config);
        });
    }

    function unauthenticated(){
        Auth.logout();
        authService.loginCancelled();
    }
}