'use strict';

/* Controllers */
angular.module('app.controllers', ['favico.service']).controller('homeCtrl', ['$scope', 'favicoService', /**
 * Home view controller
 * @param {Object} $scope
 */
function($scope, favicoService) {
    //initial value
    $scope.count = 3;
    //badge +1
    $scope.plusOne = function() {
        $scope.count = $scope.count + 1;
        favicoService.badge($scope.count);
    };
    //badge -1
    $scope.minusOne = function() {
        $scope.count = ($scope.count - 1 < 0) ? 0 : ($scope.count - 1);
        favicoService.badge($scope.count);
    };
    //badge reset (count will be preserved)
    $scope.reset = function() {
        favicoService.reset();
    };
    //init value
    favicoService.badge($scope.count);
}]).controller('anotherViewCtrl', ['$scope', 'favicoService', /**
 * Another view controller
 * @param {Object} $scope
 */
function($scope, favicoService) {
    $scope.messages = [];
    for (var i = 0; i < 5; i++) {
        $scope.messages[i] = ( {
            id : (i + 1),
            title : 'Message #' + (i + 1),
            text : 'Lorem ipsum ... (' + (i + 1) + ')'
        });
    }
    $scope.removeMessage = function(message) {
        $scope.messages.splice($scope.messages.indexOf(message), 1);
        //set new value
        favicoService.badge($scope.messages.length);

    };
    //init value
    favicoService.badge($scope.messages.length);
}]);
