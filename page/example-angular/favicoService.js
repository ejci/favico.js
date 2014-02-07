'use strict';

/**
 * Simple favicon service
 */
angular.module('favico.service', []).factory('favicoService', [
function() {
    var favico = new Favico({
        animation : 'fade'
    });

    var badge = function(num) {
        favico.badge(num);
    };
    var reset = function() {
        favico.reset();
    };

    return {
        badge : badge,
        reset : reset
    };
}]);
