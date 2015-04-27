/**
 * Created by igorsantana on 3/10/15.
 */
(define([], function () {

    GumgaNav.$inject = ['$state'];

    var template = [
        '<nav id="navbar">',
        '   <a href="#" class="navbar-logo">{{title | uppercase}}</a>',
        '   <b class="pull-right"><a href class="status-navbar" ng-click="doLogout()">Logout <i class="fa fa-sign-out"></i> </a></b>',
        '    <a ng-click="treatUrl()" class="btn btn-default btn-sm pull-right" style="margin-top: 8px;margin-right: 10%">Search</a>',
        '   <input type="text" ng-model="search" class="navbar-input" placeholder="Search">',
        '</nav>'
    ];

    function GumgaNav($state) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                title: '@'
            },
            template: template.join('\n'),
            link: function (scope, el, attrs) {
                var tags = el.children();
                var input = tags[3];
                scope.treatUrl = function () {
                    $state.go('multientity', {'search': scope.search});
                };

                input.onkeypress = function (k) {
                    if (k.keyCode == 13)
                        scope.treatUrl();

                };

                scope.doLogout = function () {
                    window.sessionStorage.removeItem('token');
                    $state.go('login');
                };
            }
        };
    }

    return GumgaNav;
}));