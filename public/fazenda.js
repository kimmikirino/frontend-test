'use strict';
/* global angular, confirm */

var fazenda = angular.module('fazenda', [
  'ngRoute',
  'compiledTemplates',
  'appConfig'
]);

fazenda.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $httpProvider.defaults.withCredentials = false;

        $routeProvider
            .when('/fazenda', {
                templateUrl: 'components/fazenda.html',
                controller: 'fazendaController'
            })
            .otherwise({
              redirectTo: '/fazenda'
            });
    }
]);

fazenda.run(['$rootScope', '$location', function($rootScope, $location) {
}]);

/************************************************************************************************
 * Controllers
 ************************************************************************************************/
fazenda.controller('fazendaController', ['$scope', '$rootScope',
  function( fazendaController, $scope, $rootScope) {

  }]);
