'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', ['app.controllers']).config(['$routeProvider',
function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'homeTmpl.html',
        controller : 'homeCtrl'
    });
    $routeProvider.when('/anotherView', {
        templateUrl : 'anotherViewTmpl.html',
        controller : 'anotherViewCtrl'
    });
    $routeProvider.otherwise({
        redirectTo : '/'
    });
}]);
